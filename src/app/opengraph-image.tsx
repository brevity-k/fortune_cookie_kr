import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "포춘쿠키 - 오늘의 운세";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A0F2E 0%, #2D1B4E 50%, #1A0F2E 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative stars */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 80,
            fontSize: 24,
            opacity: 0.6,
            display: "flex",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 120,
            fontSize: 20,
            opacity: 0.5,
            display: "flex",
          }}
        >
          ⭐
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 150,
            fontSize: 18,
            opacity: 0.4,
            display: "flex",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: 200,
            fontSize: 22,
            opacity: 0.5,
            display: "flex",
          }}
        >
          ⭐
        </div>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 60,
            fontSize: 16,
            opacity: 0.3,
            display: "flex",
          }}
        >
          ✦
        </div>
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 300,
            fontSize: 14,
            opacity: 0.35,
            display: "flex",
          }}
        >
          ✦
        </div>

        {/* Subtle border */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            border: "1px solid rgba(255, 215, 0, 0.15)",
            borderRadius: 20,
            display: "flex",
          }}
        />

        {/* Cookie emoji */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 16,
            display: "flex",
          }}
        >
          🥠
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#FFD700",
            marginBottom: 12,
            display: "flex",
            textShadow: "0 0 40px rgba(255, 215, 0, 0.3)",
          }}
        >
          포춘쿠키
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.75)",
            display: "flex",
          }}
        >
          오늘의 운세를 확인하세요
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
