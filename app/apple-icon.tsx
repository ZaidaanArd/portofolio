import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#172033",
          color: "#FFFEFA",
          fontSize: 116,
          fontWeight: 700,
        }}
      >
        Z<span style={{ color: "#8AB4E8" }}>.</span>
      </div>
    ),
    { ...size }
  )
}
