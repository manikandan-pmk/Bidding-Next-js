import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

/**
 * Saves an uploaded image (from a FormData "File") to /public/uploads/<subfolder>
 * and returns the public URL path that can be stored in the DB and served
 * directly by Next.js (since anything in /public is static).
 */
export async function saveUploadedImage(
  file: File,
  subfolder: string = "qr-codes",
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PNG, JPG, and WEBP images are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 2MB");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  // This is what gets stored in the DB and returned to the client
  return `/uploads/${subfolder}/${filename}`;
}