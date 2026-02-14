import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

export const alt = "62chan - Papan Gambar Anonim Indonesia";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        background: "linear-gradient(to bottom right, #09090b, #18181b)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: "#F97316",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: 64,
            fontWeight: 800,
            marginRight: 20,
            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
          }}
        >
          62
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            background: "linear-gradient(to right, #F97316, #FED7AA)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          chan
        </div>
      </div>

      <div
        style={{
          fontSize: 32,
          color: "#A1A1AA",
          fontWeight: 600,
          marginTop: 10,
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Papan Gambar Anonim Indonesia
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 60,
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#27272A",
            padding: "10px 20px",
            borderRadius: "50px",
            fontSize: 24,
            color: "#E4E4E7",
          }}
        >
          Popkultur
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#27272A",
            padding: "10px 20px",
            borderRadius: "50px",
            fontSize: 24,
            color: "#E4E4E7",
          }}
        >
          Teknologi
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#27272A",
            padding: "10px 20px",
            borderRadius: "50px",
            fontSize: 24,
            color: "#E4E4E7",
          }}
        >
          Diskusi Bebas
        </div>
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  );
}
