"use client";

import { useEffect, useState } from "react";
import SpiderParticles from "@/components/effects/spider-particles";

const desktopQuery = "(min-width: 1025px) and (pointer: fine)";

export default function NightWeb() {
  const [showWeb, setShowWeb] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const update = () => setShowWeb(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!showWeb) return null;

  return (
    <SpiderParticles
      particleCount={110}
      particleSize={6}
      spotlightRadius={240}
      mouseConnectDist={150}
      showWeb
      particlesGlow
      particleColor="#ffb24a"
      glowColor="#ff5a1f"
      webColor="#ff8a3d"
      centerColor="#ffd27a"
    />
  );
}
