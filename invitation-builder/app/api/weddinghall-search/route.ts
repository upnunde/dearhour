import { NextResponse } from "next/server";
import { searchWeddingVenues } from "@/lib/wedding-venues";

type WeddingHallSearchItem = {
  name: string;
  area: string;
  address: string;
  phone: string;
  mapImages: string[];
  transportGuides?: Array<{ mode: string; detail: string }>;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const limit = Math.max(1, Math.min(20, Number(url.searchParams.get("limit")) || 8));
    if (!q) return NextResponse.json({ results: [] });

    const rows = searchWeddingVenues(q, limit);
    const results: WeddingHallSearchItem[] = rows.map((venue) => ({
      name: venue.name,
      area: venue.area,
      address: venue.address,
      phone: "",
      mapImages: [],
      transportGuides: venue.transportGuides ?? [],
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
