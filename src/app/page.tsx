import { ColorSwatch } from "@/components/atoms";
import Data from "@/data/data.json";

export default function Home() {
  return (
    <main>
      <div className="top-container flex flex-col items-center juctify-center gap-8">
        <div className="page-title">Color Palette Generator</div>
        <div className="color-swatches flex flex-row">
          {Object.entries(Data.colorElements.lightness).map(([key, value]) => (
            <ColorSwatch
              key={key}
              color={`hsl(${Data.colorElements.hue}, ${Data.colorElements.saturation}%, ${value})`}
              label={`${key}`}
            />
          ))}
        </div>
        <div className="color-swatches-with-text flex flex-row text-center font-mono">
          {Object.entries(Data.colorElements.lightness).map(([key, value]) => (
            <ColorSwatch
              key={key}
              showContrast={true}
              brightTextColor={`hsl(${Data.colorElements.hue}, ${Data.colorElements.saturation}%, ${Object.entries(Data.colorElements.lightness)[0][1]})`}
              darkTextColor={`hsl(${Data.colorElements.hue}, ${Data.colorElements.saturation}%, ${Object.entries(Data.colorElements.lightness)[12][1]})`}
              color={`hsl(${Data.colorElements.hue}, ${Data.colorElements.saturation}%, ${value})`}
              label={`${key}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
