export type ColorKey = "red" | "green" | "blue";
export type RGB = Record<ColorKey, number>;

export const COLORS: ColorKey[] = ["red", "green", "blue"];

export const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export const toRgbString = ({ red, green, blue }: RGB) =>
  `rgb(${red}, ${green}, ${blue})`;

export const toHex = ({ red, green, blue }: RGB) =>
  "#" +
  [red, green, blue]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

export const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", ""), 16);
  return { red: (n >> 16) & 255, green: (n >> 8) & 255, blue: n & 255 };
};

export const toHslString = ({ red, green, blue }: RGB) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const srgbToLinear = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** Converts sRGB to OKLCH (Björn Ottosson's OKLab matrices). */
export const toOklch = ({ red, green, blue }: RGB) => {
  const r = srgbToLinear(red);
  const g = srgbToLinear(green);
  const b = srgbToLinear(blue);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.hypot(A, B);
  const H = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: C, h: H < 0 ? H + 360 : H };
};

export const toOklchString = (rgb: RGB) => {
  const { l, c, h } = toOklch(rgb);
  // Grays have no meaningful hue; CSS uses `none` for that.
  const hue = c < 0.0005 ? "none" : +h.toFixed(1);
  return `oklch(${+(l * 100).toFixed(1)}% ${+c.toFixed(3)} ${hue})`;
};

export const isLight = ({ red, green, blue }: RGB) =>
  (0.299 * red + 0.587 * green + 0.114 * blue) / 255 > 0.6;

export const incValue = (value: number, step: number) => {
  if (value + step >= 256) return value;
  return value === 0 ? value + step - 1 : value + step;
};

export const decValue = (value: number, step: number) =>
  value < step ? 0 : value - step;

export const randomValue = (step: number) => {
  const numOfSteps = 256 / step + 1;
  const value = Math.floor(Math.random() * numOfSteps) * step - 1;
  return clamp(value > -1 ? value : value + 1);
};

/** Gradient showing how the color changes as one channel goes 0 → 255. */
export const channelGradient = (rgb: RGB, color: ColorKey) =>
  `linear-gradient(to right, ${toRgbString({ ...rgb, [color]: 0 })}, ${toRgbString({
    ...rgb,
    [color]: 255,
  })})`;
