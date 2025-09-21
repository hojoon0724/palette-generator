"use client";

import { ColorSwatch } from "@/components/atoms";
import { ColorValuesInput } from "@/components/atoms/color-values-input";
import { Tabs } from "@/components/organisms";
import Data from "@/data/data.json";
import { useState } from "react";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Accent on Neutral");
  const [showContrast, setShowContrast] = useState(true);
  const [neutralHsl, setNeutralHsl] = useState({
    hue: Data.neutralColorElements.hue,
    saturation: Data.neutralColorElements.saturation,
    lightness: Data.neutralColorElements.lightness,
  });
  const [accentHsl, setAccentHsl] = useState({
    hue: Data.accentColorElements.hue,
    saturation: Data.accentColorElements.saturation,
    lightness: Data.accentColorElements.lightness,
  });

  return (
    <main>
      <div className="top-container flex flex-col items-center justify-center">
        <div className="top-row flex justify-between w-full items-center px-16 py-8">
          <h3 className="page-title mb-8">Color Palette Generator</h3>
          {/* show hide contrast */}
          <button onClick={() => setShowContrast(!showContrast)}>
            {showContrast ? "Hide Contrast" : "Show Contrast"}
          </button>
        </div>
        <div className="color-palette-input-container flex flex-col lg:flex-row justify-between gap-x-48">
          <ColorValuesInput
            hsl={neutralHsl}
            label="Neutral Colors"
            onHueChange={(hue) => setNeutralHsl((prev) => ({ ...prev, hue }))}
            onSaturationChange={(saturation) => setNeutralHsl((prev) => ({ ...prev, saturation }))}
            onLightnessChange={(key, value) =>
              setNeutralHsl((prev) => ({
                ...prev,
                lightness: { ...prev.lightness, [key]: value },
              }))
            }
          />
          <ColorValuesInput
            hsl={accentHsl}
            label="Accent Colors"
            onHueChange={(hue) => setAccentHsl((prev) => ({ ...prev, hue }))}
            onSaturationChange={(saturation) => setAccentHsl((prev) => ({ ...prev, saturation }))}
            onLightnessChange={(key, value) =>
              setAccentHsl((prev) => ({
                ...prev,
                lightness: { ...prev.lightness, [key]: value },
              }))
            }
          />
        </div>

        {/* white text on neutral colors */}
        <div className="neutral-color-swatches-with-light-text flex flex-row text-center font-mono">
          {Object.entries(neutralHsl.lightness).map(([key, value]) => (
            <ColorSwatch
              key={key}
              showContrast={true}
              textColor={`hsl(${neutralHsl.hue}, ${neutralHsl.saturation}%, ${neutralHsl.lightness[30]})`}
              color={`hsl(${neutralHsl.hue}, ${neutralHsl.saturation}%, ${value})`}
              label={`${key}`}
            />
          ))}
        </div>

        {/* black text on neutral colors */}
        <div className="neutral-color-swatches-with-dark-text flex flex-row text-center font-mono">
          {Object.entries(neutralHsl.lightness).map(([key, value]) => (
            <ColorSwatch
              key={key}
              showContrast={true}
              textColor={`hsl(${neutralHsl.hue}, ${neutralHsl.saturation}%, ${neutralHsl.lightness[970]})`}
              color={`hsl(${neutralHsl.hue}, ${neutralHsl.saturation}%, ${value})`}
              label={`${key}`}
            />
          ))}
        </div>

        <Tabs
          tabs={["Accent on Neutral", "Neutral on Accent"]}
          selectedTab={selectedTab}
          className="my-8"
          onSelectTab={(tab) => {
            setSelectedTab(tab);
          }}
        >
          {(() => {
            // Determine which data to use based on selected tab
            const isAccentOnNeutral = selectedTab === "Accent on Neutral";
            const textColorData = isAccentOnNeutral ? accentHsl : neutralHsl;
            const backgroundColorData = isAccentOnNeutral ? neutralHsl : accentHsl;

            return (
              <div className={isAccentOnNeutral ? "neutral-bg-accent-text-matrix" : "accent-bg-neutral-text-matrix"}>
                {Object.entries(textColorData.lightness).map(([key, value]) => {
                  const textColor = `hsl(${textColorData.hue}, ${textColorData.saturation}%, ${value})`;
                  return (
                    <div
                      className={`${isAccentOnNeutral ? "neutral-color-swatches-with-accent-text" : "accent-color-swatches-with-neutral-text"} flex flex-row text-center font-mono`}
                      key={key}
                    >
                      {Object.entries(backgroundColorData.lightness).map(([bgKey, bgValue]) => (
                        <ColorSwatch
                          key={bgKey}
                          showContrast={showContrast}
                          textColor={textColor}
                          color={`hsl(${backgroundColorData.hue}, ${backgroundColorData.saturation}%, ${bgValue})`}
                          label={`${bgKey}`}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </Tabs>
      </div>
    </main>
  );
}
