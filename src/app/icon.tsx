import { brandAppIcon } from "@/lib/server/brand-image";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return brandAppIcon(size.width);
}
