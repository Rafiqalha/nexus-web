import { ImageResponse } from "next/og";
export const alt =
  "Nexus — Security for human-verified interactions. Developer preview.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#FAFAF8",
        color: "#171A21",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 36, color: "#2457E6" }}>
        Nexus.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          letterSpacing: -3,
          maxWidth: 960,
        }}
      >
        Security for human-verified interactions.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#596273" }}>
        Device integrity · Session evidence · Server verification
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#2457E6" }}>
        Developer preview / Android staging
      </div>
    </div>,
    size,
  );
}
