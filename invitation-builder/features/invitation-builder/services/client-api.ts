import type { CardData } from "@/features/invitation-builder/model/types";
import type { WeddingVenue } from "@/lib/wedding-venues";

type VenueSuggestion = WeddingVenue & {
  phone?: string;
  mapImages?: string[];
};

type TransitGuide = { mode: string; detail: string };

export async function searchWeddingHallSuggestions(query: string, limit = 8): Promise<VenueSuggestion[]> {
  const res = await fetch(`/api/weddinghall-search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) return [];
  const json = (await res.json()) as { results?: VenueSuggestion[] };
  return Array.isArray(json.results) ? json.results : [];
}

export async function fetchWeddingHallTransit(address: string): Promise<TransitGuide[]> {
  const res = await fetch(`/api/weddinghall-transit?address=${encodeURIComponent(address)}`);
  if (!res.ok) return [];
  const json = (await res.json()) as { guides?: TransitGuide[] };
  return Array.isArray(json.guides) ? json.guides : [];
}

export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<{ lat: number; lon: number } | null> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { lat?: number; lon?: number };
  const lat = typeof json.lat === "number" ? json.lat : NaN;
  const lon = typeof json.lon === "number" ? json.lon : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

export async function saveInvitationDraft(input: {
  title: string;
  payload: CardData;
}): Promise<Response> {
  return fetch("/api/invitations/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
