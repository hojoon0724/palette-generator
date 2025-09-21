import { contrastRatioFromHsl, isAccessibleContrast } from "@/utils";

type ColorSwatchProps = Readonly<{
  color: string;
  label: string;
  showContrast?: boolean;
  brightTextColor?: string;
  darkTextColor?: string;
}>;

export function ColorSwatch({ color, label, showContrast = false, brightTextColor, darkTextColor }: ColorSwatchProps) {
  // If contrast testing is requested, we need both text colors
  if (showContrast && (!brightTextColor || !darkTextColor)) {
    console.warn("ColorSwatch: showContrast=true requires both brightTextColor and darkTextColor");
    // Fallback to simple variant
    showContrast = false;
  }

  if (!showContrast) {
    return (
      <div className="color-swatch flex flex-col items-center gap-2">
        <div className="color-label">{label}</div>
        <div className="color-box h-24 w-24" style={{ backgroundColor: color }} title={color}></div>
      </div>
    );
  }

  // Render with contrast testing
  const brightRatio = contrastRatioFromHsl(color, brightTextColor!);
  const darkRatio = contrastRatioFromHsl(color, darkTextColor!);

  return (
    <div className="color-swatch flex flex-col items-center gap-2">
      <div
        className="color-box h-36 w-24 flex flex-col justify-center items-center"
        style={{ backgroundColor: color }}
        title={color}
      >
        <div className="color-label px-1" style={{ color: brightTextColor }}>
          <span className="text-xs">{label}</span>
          <br />
          <span style={{ color: isAccessibleContrast(color, brightTextColor!) ? "green" : "red" }}>
            {brightRatio.toFixed(2)}{" "}
          </span>
        </div>

        <div className="color-label px-1" style={{ color: darkTextColor }}>
          <span className="text-xs">{label}</span>
          <br />
          <span style={{ color: isAccessibleContrast(color, darkTextColor!) ? "green" : "red" }}>
            {darkRatio.toFixed(2)}{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

// Backwards compatibility: alias the old name to the new unified component
export { ColorSwatch as ColorSwatchWithText };
