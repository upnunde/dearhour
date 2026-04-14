import { NextResponse } from "next/server";
import { getDefaultTransitGuides } from "@/lib/default-transit-guides";

type NominatimResult = {
  lat?: string;
  lon?: string;
};

type OverpassElement = {
  type?: string;
  tags?: Record<string, string>;
};

function normalizeBusRef(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function splitRouteTokens(raw: string) {
  return raw
    .split(/[,\s/;]+/)
    .map((v) => normalizeBusRef(v))
    .filter(Boolean);
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function geocodeAddress(address: string, signal: AbortSignal) {
  const nominatim = new URL("https://nominatim.openstreetmap.org/search");
  nominatim.searchParams.set("format", "json");
  nominatim.searchParams.set("limit", "1");
  nominatim.searchParams.set("q", address);
  const res = await fetch(nominatim.toString(), {
    method: "GET",
    signal,
    headers: {
      "Accept-Language": "ko",
      "User-Agent": "dearhour-invitation-builder/0.1 (contact: unknown)",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as NominatimResult[];
  const first = Array.isArray(json) ? json[0] : null;
  if (!first?.lat || !first?.lon) return null;
  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

async function fetchTransitNearPoint(lat: number, lon: number, signal: AbortSignal) {
  const queryOverpass = async (query: string) => {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "User-Agent": "dearhour-invitation-builder/0.1 (contact: unknown)",
      },
      body: query,
    });
    if (!res.ok) return [] as OverpassElement[];
    const json = (await res.json()) as { elements?: OverpassElement[] };
    return Array.isArray(json.elements) ? json.elements : [];
  };

  const busStopElements = await queryOverpass(`
[out:json][timeout:15];
(
  node(around:700,${lat},${lon})["highway"="bus_stop"];
  node(around:700,${lat},${lon})["public_transport"="platform"]["bus"="yes"];
);
out tags;
`.trim());

  let busRefs = dedupe(
    busStopElements.flatMap((el) => {
      const tags = el.tags ?? {};
      return splitRouteTokens(`${tags.route_ref ?? ""},${tags.bus_routes ?? ""},${tags.lines ?? ""},${tags.ref ?? ""}`);
    }),
  );

  if (busRefs.length === 0) {
    const busRouteElements = await queryOverpass(`
[out:json][timeout:15];
relation(around:1200,${lat},${lon})["type"="route"]["route"="bus"];
out tags;
`.trim());
    busRefs = dedupe(
      busRouteElements.flatMap((el) => {
        const tags = el.tags ?? {};
        return [...splitRouteTokens(tags.ref ?? ""), ...splitRouteTokens(tags.name ?? "")];
      }),
    );
  }

  const subwayElements = await queryOverpass(`
[out:json][timeout:15];
(
  node(around:1400,${lat},${lon})["railway"="station"];
  node(around:1400,${lat},${lon})["station"="subway"];
  relation(around:1600,${lat},${lon})["type"="route"]["route"="subway"];
);
out tags;
`.trim());
  const subwayNames = dedupe(
    subwayElements
      .map((el) => (el.tags?.name ?? el.tags?.ref ?? "").replace(/\s+/g, " ").trim())
      .filter(Boolean),
  );

  const parkingElements = await queryOverpass(`
[out:json][timeout:15];
(
  node(around:500,${lat},${lon})["amenity"="parking"];
  way(around:500,${lat},${lon})["amenity"="parking"];
);
out tags;
`.trim());
  const parkingCount = parkingElements.length;
  return { busRefs, subwayNames, parkingCount };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const address = (url.searchParams.get("address") ?? "").trim();
    if (!address) {
      return NextResponse.json({ guides: getDefaultTransitGuides() });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    try {
      const point = await geocodeAddress(address, controller.signal);
      if (!point) {
        return NextResponse.json({
          guides: getDefaultTransitGuides(),
        });
      }
      let busRefs: string[] = [];
      let subwayNames: string[] = [];
      let parkingCount = 0;
      try {
        const transit = await fetchTransitNearPoint(point.lat, point.lon, controller.signal);
        busRefs = transit.busRefs;
        subwayNames = transit.subwayNames;
        parkingCount = transit.parkingCount;
      } catch {
        // 교통 데이터 API 실패 시 기본 안내 문구로 대체
      }
      const guides: Array<{ mode: string; detail: string }> = [];

      if (subwayNames.length > 0) {
        guides.push({
          mode: "지하철",
          detail: `인근 지하철 노선/역: ${subwayNames.slice(0, 4).join(", ")}`,
        });
      } else {
        guides.push({
          mode: "지하철",
          detail: "가까운 지하철역 안내는 예식장 약도(상세 지도) 기준으로 확인해 주세요.",
        });
      }
      if (busRefs.length > 0) {
        guides.push({
          mode: "버스",
          detail: `인근 버스 노선: ${busRefs.slice(0, 10).join(", ")}`,
        });
      } else {
        guides.push({
          mode: "버스",
          detail: "버스 노선 번호는 예식장 약도에 기재된 최신 정보를 확인해 주세요.",
        });
      }
      guides.push({
        mode: "주차장",
        detail:
          parkingCount > 0
            ? `반경 500m 내 주차장 ${parkingCount}곳이 확인됩니다. (현장 운영 기준은 예식장에 문의해 주세요)`
            : "주차 가능 여부 및 할인 조건은 예식장으로 확인해 주세요.",
      });

      return NextResponse.json({
        guides: guides.slice(0, 3),
        point,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return NextResponse.json({ guides: getDefaultTransitGuides() });
  }
}
