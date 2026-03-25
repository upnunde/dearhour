import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

function safeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const guestName = String(formData.get("guestName") ?? "").trim();
    const invitationId = String(formData.get("invitationId") ?? "").trim() || "default-invitation";
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (!guestName) {
      return Response.json({ error: "이름을 입력해 주세요." }, { status: 400 });
    }
    if (files.length === 0) {
      return Response.json({ error: "업로드할 파일을 선택해 주세요." }, { status: 400 });
    }

    const safeInvitationId = safeSegment(invitationId) || "default-invitation";
    const safeGuest = safeSegment(guestName) || "guest";
    const folderName = `${safeGuest}-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const targetDir = path.join(process.cwd(), "public", "uploads", safeInvitationId, folderName);
    await mkdir(targetDir, { recursive: true });

    const uploaded: Array<{ name: string; url: string; size: number; type: string }> = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return Response.json({ error: `지원하지 않는 파일 형식입니다: ${file.name}` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return Response.json({ error: `파일 용량 제한(100MB)을 초과했습니다: ${file.name}` }, { status: 400 });
      }

      const ext = path.extname(file.name) || "";
      const base = safeSegment(path.basename(file.name, ext)) || "file";
      const fileName = `${base}-${randomUUID().slice(0, 6)}${ext.toLowerCase()}`;
      const outputPath = path.join(targetDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(outputPath, Buffer.from(arrayBuffer));

      uploaded.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/${safeInvitationId}/${folderName}/${fileName}`,
      });
    }

    return Response.json({
      ok: true,
      guestName,
      invitationId: safeInvitationId,
      folder: folderName,
      uploaded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다.";
    return Response.json({ error: message }, { status: 500 });
  }
}
