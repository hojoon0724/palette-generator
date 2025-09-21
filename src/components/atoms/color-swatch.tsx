import { contrastRatioFromHsl, isAccessibleContrast } from "@/utils";

type ColorSwatchProps = Readonly<{
  color: string;
  label?: string;
  showContrast?: boolean;
  textColor?: string;
}>;

export function ColorSwatch({ color, label, showContrast = false, textColor }: ColorSwatchProps) {
  // If contrast testing is requested, we need a text color
  if (showContrast && !textColor) {
    console.warn("ColorSwatch: showContrast=true requires textColor");
    // Fallback to simple variant
    showContrast = false;
  }

  // Render with contrast testing
  const contrastRatio = textColor ? contrastRatioFromHsl(color, textColor) : null;

  return (
    <div className="color-swatch flex flex-col items-center gap-2">
      <div
        className="color-box h-24 w-24 flex flex-col justify-center items-center"
        style={{ backgroundColor: color }}
        title={color}
      >
        {textColor && contrastRatio !== null && (
          <div className="color-label px-1" style={{ color: textColor }}>
            <span className="text-lg font-bold">{label}</span>
            <br />
            {showContrast && (
            <span
              className="px-1"
              style={{
                backgroundColor: isAccessibleContrast(color, textColor) ? "green" : "red",
                color: "white",
              }}
            >
              {contrastRatio.toFixed(2)}{" "}
            </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Backwards compatibility: alias the old name to the new unified component
export { ColorSwatch as ColorSwatchWithText };
