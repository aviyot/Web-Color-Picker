import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — RGB color mixer and color name finder`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SWATCHES = ["#E63946", "#F4A261", "#E9C46A", "#2A9D8F", "#457B9D", "#7B4259"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#212529",
          color: "#fff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700 }}>{SITE_NAME}</div>
          <div style={{ fontSize: 40, opacity: 0.8, marginTop: 12 }}>
            Mix a color · Find its name · Copy its code
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {SWATCHES.map((color) => (
            <div
              key={color}
              style={{ flex: 1, height: 160, borderRadius: 24, background: color }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
