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
