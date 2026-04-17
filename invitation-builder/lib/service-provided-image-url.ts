import { DEFAULT_MAIN_PRESET_URL, MAIN_IMAGE_PRESETS } from "@/lib/main-image-presets";

function pathnameOf(src: string): string {
  const raw = String(src ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return new URL(raw).pathname;
    } catch {
      return raw.split("?")[0] ?? raw;
    }
  }
  return raw.split("?")[0] ?? raw;
}

/**
 * 서비스에서 제공하는 기본/프리셋 썸네일·일러스트 URL인지 판별합니다.
 * (blob·data URL은 사용자 업로드로 간주해 false)
 */
export function isServiceProvidedThumbnailUrl(src: string): boolean {
  const raw = String(src ?? "").trim();
  if (!raw) return false;
  if (raw.startsWith("blob:")) return false;
  if (raw.startsWith("data:")) return false;

  const path = pathnameOf(raw);

  if (path === "/chrysanthemum.svg" || path.endsWith("/chrysanthemum.svg")) return true;
  if (/^\/flower\d+\.svg$/i.test(path)) return true;

  if (path.includes("/images/main-presets/")) return true;
  if (path.includes("/images/share-thumbnails/")) return true;

  if (raw === DEFAULT_MAIN_PRESET_URL || path === DEFAULT_MAIN_PRESET_URL) return true;
  if (MAIN_IMAGE_PRESETS.some((p) => raw === p.url || path === p.url || path.endsWith(p.url))) return true;

  return false;
}
