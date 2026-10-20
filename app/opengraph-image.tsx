import { ImageResponse } from "next/og"

export const alt = "Muhammad Zaidaan Ardiyansyah — Frontend Developer Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F3EE",
          color: "#172033",
          padding: "64px 72px",
          border: "16px solid #172033",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#1D4E89" }}>Portfolio / 2026</span>
          <span>Zaidaan.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              maxWidth: 980,
              fontFamily: "Georgia, serif",
              fontSize: 88,
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
            }}
          >
            Clear, fast, and considered web experiences.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24 }}>
            <span style={{ width: 12, height: 12, background: "#1D4E89" }} />
            Muhammad Zaidaan Ardiyansyah / Frontend Developer
          </div>
        </div>
      </div>
    ),
    size
  )
}
