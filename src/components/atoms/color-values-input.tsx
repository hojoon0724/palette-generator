type ColorValuesInputProps = {
  hsl: {
    hue: number;
    saturation: number;
    lightness: { [key: string]: number | string };
  };
  onHueChange?: (hue: number) => void;
  onSaturationChange?: (saturation: number) => void;
  onLightnessChange?: (key: string, value: number | string) => void;
  label?: string;
};

export function ColorValuesInput({
  hsl,
  onHueChange,
  onSaturationChange,
  onLightnessChange,
  label,
}: ColorValuesInputProps) {
  const { hue, saturation, lightness } = hsl;

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(360, value)); // Clamp hue to 0-360
    onHueChange?.(clampedValue);
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(100, value)); // Clamp saturation to 0-100
    onSaturationChange?.(clampedValue);
  };

  const handleLightnessChange = (key: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numericValue)); // Clamp lightness to 0-100
    // Keep as string with % for consistency with data format
    onLightnessChange?.(key, `${clampedValue}%`);
  };

  return (
    <div className="color-values-input-container flex flex-col mb-4">
      {label && <h4 className="mb-2 font-semibold">{label}</h4>}
      <div className="flex flex-col gap-4">
        <div className="hue-saturation-container flex gap-4 w-full">
          <div className="value-container flex flex-col w-full">
            <label className="color-input-label text-sm mb-1" htmlFor="hue">
              Hue
            </label>
            <div className="hue-input-container flex justify-between items-center gap-2">
              <input
                className="color-input-field text-center px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                id="hue"
                min="0"
                max="360"
                value={hue}
                onChange={handleHueChange}
              />
              <input
                type="range"
                className="color-input-field border py-1 w-full"
                id="hue-slider"
                min="0"
                max="360"
                step="1"
                value={hue}
                onChange={handleHueChange}
              />
            </div>
          </div>
          <div className="value-container flex flex-col w-full">
            <label className="color-input-label text-sm mb-1" htmlFor="saturation">
              Saturation
            </label>
            <div className="saturation-input-container flex justify-between items-center gap-2">
              <input
                className="color-input-field text-center px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                id="saturation"
                min="0"
                max="100"
                value={saturation}
                onChange={handleSaturationChange}
              />
              <input
                type="range"
                className="color-input-field border py-1 w-full"
                id="saturation-slider"
                min="0"
                max="100"
                step="1"
                value={saturation}
                onChange={handleSaturationChange}
              />
            </div>
          </div>
        </div>
        <div className="value-container flex flex-col gap-2">
          <label className="color-input-label text-sm mb-1">Lightness</label>
          <div className="flex">
            {Object.entries(lightness).map(([key, value]) => (
              <div
                key={key}
                className="lightness-value-container flex flex-col w-[4ch] font-mono justify-between items-center"
              >
                <span className="text-xs w-full text-center">{key}</span>
                <input
                  className="text-xs w-full text-center border px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  min="0"
                  max="100"
                  value={typeof value === "string" ? parseFloat(value) || 0 : value}
                  onChange={(e) => handleLightnessChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
