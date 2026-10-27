import { ImageResponse } from "next/og";
import { brandImageData } from "@/lib/server/brand-image";

export const alt =
  "Nexus — Security for human-verified interactions. Developer preview.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const emblem = await brandImageData();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 64,
        flexDirection: "column",
        background: "#000",
        color: "#f7f8f8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Embedded source for ImageResponse. */}
          <img src={emblem} width={64} height={64} alt="" />
          <span style={{ fontSize: 26, letterSpacing: 6 }}>NEXUS</span>
        </div>
        <span style={{ fontSize: 14, letterSpacing: 3, color: "#8a8f98" }}>
          DEVELOPER PREVIEW
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 700,
          marginTop: 52,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 66,
            letterSpacing: -2.5,
            lineHeight: 1.08,
          }}
        >
          Security for
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            letterSpacing: -2.5,
            lineHeight: 1.08,
          }}
        >
          human-verified
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            letterSpacing: -2.5,
            lineHeight: 1.08,
          }}
        >
          interactions.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 20,
            color: "#8a8f98",
          }}
        >
          Device integrity · Session evidence · Server verification
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          right: 64,
          top: 190,
          width: 292,
          height: 310,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Embedded source for ImageResponse. */}
        <img
          src={emblem}
          width={440}
          height={440}
          alt=""
          style={{ position: "absolute", left: -74, top: -65 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 48,
          paddingTop: 22,
          borderTop: "1px solid #23252a",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 15,
          color: "#8a8f98",
        }}
      >
        <span>Android staging integration</span>
        <span>Synthetic demo · Explicit evidence boundaries</span>
      </div>
    </div>,
    size,
  );
}
