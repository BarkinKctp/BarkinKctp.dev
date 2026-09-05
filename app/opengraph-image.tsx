import { renderOgImage, ogAlt, ogSize, ogContentType } from "@/lib/og-image";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return renderOgImage();
}
