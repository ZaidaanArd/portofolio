import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
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
          fontSize: 21,
          fontWeight: 700,
        }}
      >
        Z<span style={{ color: "#8AB4E8" }}>.</span>
      </div>
    ),
    { ...size }
  )
}
