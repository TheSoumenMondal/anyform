"use client";

import React from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

const AuthLayoutIllustration = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <ShaderGradientCanvas
        lazyLoad
        className="w-full h-full rounded-md opacity-50 pointer-events-none select-none"
        style={{
          touchAction: "none",
        }}
      >
        <ShaderGradient
          animate="on"
          brightness={1.1}
          cAzimuthAngle={180}
          cDistance={3.6}
          cPolarAngle={90}
          cameraZoom={1}
          color1="#ff0000"
          color2="#fff94d"
          color3="#7bbc1a"
          envPreset="lobby"
          grain="on"
          grainBlending={0.2}
          zoomOut={false}
          lightType="3d"
          positionX={-1.4}
          positionY={0}
          positionZ={0}
          range="disabled"
          reflection={0.1}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          shader="defaults"
          type="plane"
          uAmplitude={1}
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={4}
          wireframe={false}
          control="props"
          enableCameraUpdate={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default AuthLayoutIllustration;
