import { NextResponse } from "next/server";

type WeddingHallSearchItem = {
  name: string;
  area: string;
  address: string;
  phone: string;
  mapImages: string[];
};

const BARUNSON_SEARCH_URL = "https://www.barunsoncard.com/Guide/SearchWeddingHall";

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function inferArea(address: string) {
  const tokens = address.split(/\s+/).filter(Boolean);
  return tokens.slice(0, 2).join(" ").trim();
}

function parseMapImagesByTargetId(html: string, targetId: string) {
  const escapedId = targetId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const layerRegex = new RegExp(`<div id="${escapedId}"[\\s\\S]*?<div class="weddinghall-map-grid">([\\s\\S]*?)</div>`, "i");
  const layerMatch = html.match(layerRegex);
  if (!layerMatch) return [];
  const imageMatches = layerMatch[1].matchAll(/<img[^>]+src="([^"]+)"/g);
  const images = Array.from(imageMatches, (m) => m[1].trim()).filter(Boolean);
  return Array.from(new Set(images));
}

function parseRowsFromHtml(html: string) {
  const bodyStart = html.indexOf('<div class="table-item body">');
  const bodyHtml = bodyStart >= 0 ? html.slice(bodyStart) : html;
  const rowRegex =
    /<div class="table-row">\s*<div class="table-cell w-300">([^<]*)<\/div>\s*<div class="table-cell auto">([^<]*)<\/div>\s*<div class="table-cell w-200">([^<]*)<\/div>\s*<div class="table-cell w-100">\s*<button[^>]*data-target="([^"]+)"/g;

  const parsed: WeddingHallSearchItem[] = [];
  for (const match of bodyHtml.matchAll(rowRegex)) {
    const name = stripTags(match[1]);
    const address = stripTags(match[2]);
    const phone = stripTags(match[3]);
    const targetId = stripTags(match[4]);
    if (!name || !address || /예식장명|주소|전화번호|보유약도/.test(name)) continue;
    parsed.push({
      name,
      address,
      phone,
      area: inferArea(address),
      mapImages: parseMapImagesByTargetId(html, targetId),
    });
  }
  return parsed;
}

async function fetchVerificationToken() {
  const res = await fetch(BARUNSON_SEARCH_URL, {
    method: "GET",
    headers: { "User-Agent": "dearhour-invitation-builder/0.1" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const html = await res.text();
  const tokenMatch = html.match(/name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"/);
  if (!tokenMatch) return null;
  const cookie = res.headers.get("set-cookie") ?? "";
  return { token: tokenMatch[1], cookie };
}

async function searchBarunsonWeddingHalls(keyword: string) {
  const auth = await fetchVerificationToken();
  if (!auth) return [];

  const body = new URLSearchParams();
  body.set("SearchKeyword", keyword);
  body.set("Location", "0");
  body.set("__RequestVerificationToken", auth.token);

  const res = await fetch(BARUNSON_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "dearhour-invitation-builder/0.1",
      ...(auth.cookie ? { Cookie: auth.cookie } : {}),
      Referer: BARUNSON_SEARCH_URL,
      Origin: "https://www.barunsoncard.com",
    },
    body: body.toString(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const html = await res.text();
  return parseRowsFromHtml(html);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const limit = Math.max(1, Math.min(20, Number(url.searchParams.get("limit")) || 8));
    if (!q) return NextResponse.json({ results: [] });

    const rows = await searchBarunsonWeddingHalls(q);
    const keyword = q.replace(/\s+/g, "").toLowerCase();
    const sorted = rows
      .sort((a, b) => {
        const aKey = a.name.replace(/\s+/g, "").toLowerCase();
        const bKey = b.name.replace(/\s+/g, "").toLowerCase();
        const aScore = aKey === keyword ? 3 : aKey.includes(keyword) ? 2 : 1;
        const bScore = bKey === keyword ? 3 : bKey.includes(keyword) ? 2 : 1;
        return bScore - aScore;
      })
      .slice(0, limit);

    return NextResponse.json({ results: sorted });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
