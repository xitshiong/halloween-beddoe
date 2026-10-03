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
      particleCount={72}
      particleSize={7}
      spotlightRadius={210}
      mouseConnectDist={130}
      showWeb
      particlesGlow
      particleColor="#f4e7d2"
      glowColor="#e7c27a"
      webColor="#d9c6f2"
      centerColor="#f6c56b"
    />
  );
}
