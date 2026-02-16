import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Fetch font
const dotoFont = fetch(
  "https://fonts.gstatic.com/s/doto/v3/t5tJIRMbNJ6TQG7Il_EKPqP9zTnvqqGNcuvLMt1JIphFuOWezw.ttf",
).then((res) => res.arrayBuffer());

// Image generation
export default async function Icon() {
  const fontData = await dotoFont;

  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        // background: "#117743", // Classic chan green
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Doto",
        borderRadius: "4px",
      }}
    >
      62
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Doto",
          data: fontData,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
