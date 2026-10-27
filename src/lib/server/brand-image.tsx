import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";

export async function brandImageData() {
  "use cache";
  cacheLife("max");
  const image = await readFile(
    join(process.cwd(), "public/icon/Interlocking Nexus N emblem.png"),
  );
  return `data:image/png;base64,${image.toString("base64")}`;
}

export async function brandAppIcon(size: number) {
  const source = await brandImageData();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000",
        borderRadius: size * 0.2,
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded assets, not Next Image. */}
      <img
        src={source}
        width={size * 1.24}
        height={size * 1.24}
        alt=""
        style={{ position: "absolute", left: -size * 0.12, top: -size * 0.125 }}
      />
    </div>,
    { width: size, height: size },
  );
}
