import { ImageResponse } from "next/og";

export const ogAlt = "Barkin Kocatepe — Software Engineer";
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 55%, #164e63 100%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#22d3ee",
          }}
        >
          Portfolio
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          Barkin Kocatepe
        </div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#cbd5e1" }}>
          Software Engineer · Cloud · Distributed Systems · DevOps
        </div>
        <div style={{ fontSize: 30, marginTop: 48, color: "#94a3b8" }}>
          barkinkocatepe.dev
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
