// Correct WCAG 2.x contrast implementation for HSL color inputs
// Includes helpers to parse HSL/HSLA strings, compute relative luminance, and contrast ratio.

type RGB = { r: number; g: number; b: number }; // 0..1 sRGB
type HSL = { h: number; s: number; l: number; a?: number };

// Parse strings like: hsl(210, 50%, 40%) or hsla(210, 50%, 40%, 0.8)
function parseHsl(input: string): HSL {
  const re =
    /hsla?\(\s*([+-]?\d*\.?\d+)\s*(?:deg)?\s*,\s*([+-]?\d*\.?\d+)%?\s*,\s*([+-]?\d*\.?\d+)%?(?:\s*,\s*([+-]?\d*\.?\d+))?\s*\)/i;
  const m = input.match(re);
  if (!m) {
    throw new Error(`Unsupported color format (expected hsl/hsla): ${input}`);
  }
  let h = Number(m[1]);
  let s = Number(m[2]);
  let l = Number(m[3]);
  const a = m[4] !== undefined ? Number(m[4]) : undefined;

  // Normalize
  if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) {
    throw new Error(`Invalid HSL numbers: ${input}`);
  }
  // Wrap hue to [0,360)
  h = ((h % 360) + 360) % 360;
  // If s/l were provided as 0..100, convert to 0..1; if they were already 0..1 keep them in range
  s = s > 1 ? s / 100 : s;
  l = l > 1 ? l / 100 : l;
  // Clamp
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));

  return { h, s, l, a };
}

// HSL (deg, 0..1, 0..1) -> sRGB (0..1)
function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) {
    // Achromatic
    return { r: l, g: l, b: l };
  }
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hp >= 0 && hp < 1) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (hp < 2) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (hp < 3) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (hp < 4) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (hp < 5) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }
  const m = l - c / 2;
  return { r: r1 + m, g: g1 + m, b: b1 + m };
}

// Convert sRGB 0..1 to linear light
function srgbToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Relative luminance per WCAG
export function relativeLuminanceFromRgb(rgb: RGB): number {
  const R = srgbToLinear(rgb.r);
  const G = srgbToLinear(rgb.g);
  const B = srgbToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatioFromLuminance(L1: number, L2: number): number {
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

export function contrastRatioFromHsl(bgColor: string, textColor: string): number {
  const bg = parseHsl(bgColor);
  const fg = parseHsl(textColor);
  const bgRgb = hslToRgb(bg.h, bg.s, bg.l);
  const fgRgb = hslToRgb(fg.h, fg.s, fg.l);
  const L1 = relativeLuminanceFromRgb(bgRgb);
  const L2 = relativeLuminanceFromRgb(fgRgb);
  return contrastRatioFromLuminance(L1, L2);
}

// Backwards-compatible API (AA for normal text: >= 4.5)
export function ColorContrastCheck(bgColor: string, textColor: string): {ratio: number; isAccessible: boolean} {
  const ratio = contrastRatioFromHsl(bgColor, textColor);
  return {ratio: ratio, isAccessible: ratio >= 4.5};
}

// Optional: helper for other thresholds
export type WCAGLevel = "AA" | "AAA";
export function isAccessibleContrast(
  bgColor: string,
  textColor: string,
  level: WCAGLevel = "AA",
  largeText = false
): boolean {
  const ratio = contrastRatioFromHsl(bgColor, textColor);
  const threshold = level === "AAA" ? (largeText ? 4.5 : 7) : largeText ? 3 : 4.5;
  return ratio >= threshold;
}
