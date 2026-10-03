// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createSuspendedRaf } from "./createSuspendedRaf";

//  Constants
const MOUSE_OFFSCREEN = -9999;
const MOUSE_THRESHOLD = -9000; // anything above this = mouse is on screen

const LERP_SPEED = 0.1;
const FADE_SPEED = 0.04;

const REDUCED_MOTION_FACTOR = 0.6;

// GLSL Shaders

const PARTICLE_VERT = /* glsl */ `
  uniform float uSize;
  uniform vec2  uMouse;
  uniform float uSpotlightRadius;

  void main() {
    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist  = distance(position.xy, uMouse);
    float scale = dist < uSpotlightRadius
      ? 1.0 - (dist / uSpotlightRadius)
      : 0.0;

    gl_PointSize = uSize * scale;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const CURSOR_VERT = /* glsl */ `
  uniform float uSize;

  void main() {
    vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

// Shared by both particle dots and the cursor dot
const POINT_FRAG = /* glsl */ `
  uniform vec3  uColor;
  uniform vec3  uGlow;
  uniform bool  uGlowEnabled;
  uniform float uAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;

    if (uGlowEnabled) {
      float core  = smoothstep(0.5, 0.0, d);
      float glow  = smoothstep(0.5, 0.1, d) * 0.6;
      vec3  col   = mix(uGlow, uColor, core);
      float alpha = (core + glow) * uAlpha;
      gl_FragColor = vec4(col, alpha);
    } else {
      float alpha = smoothstep(0.5, 0.45, d) * uAlpha;
      gl_FragColor = vec4(uColor, alpha);
    }
  }
`;

interface SpiderParticlesProps {
  particleCount?: number;
  gridGap?: number;
  particleSize?: number;
  mouseConnectDist?: number;
  spotlightRadius?: number;
  showWeb?: boolean;
  particlesGlow?: boolean;
  glowColor?: string | number;
  particleColor?: string | number;
  webColor?: string | number;
  centerColor?: string | number;
  className?: string;
}

// Component
export default function SpiderParticles({
  particleCount = 180,
  gridGap = 0,
  particleSize = 20.0,
  mouseConnectDist = 160,
  spotlightRadius = 300,
  showWeb = true,
  particlesGlow = false,
  glowColor = 0xffffff,
  particleColor = 0xffffff,
  webColor = 0xffffff,
  centerColor = 0xffffff,
  className = "",
}: SpiderParticlesProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    const _glowColor     = new THREE.Color(glowColor);
    const _particleColor = new THREE.Color(particleColor);
    const _webColor      = new THREE.Color(webColor);
    const _centerColor   = new THREE.Color(centerColor);



    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, -500, 500,
    );
    camera.position.z = 1;

    // Mouse State
    const mouse       = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
    const smoothMouse = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
    let mouseEntryAlpha = 0;
    let mousePresent    = false;
    let mouseJustEntered = false; // snap smoothMouse on the first frame after cursor enters

    const isDesktop = () => window.innerWidth >= 1025;

    // Listens on window so content layered above the canvas doesn't block tracking.
    const onMove = (e: MouseEvent) => {
      if (!isDesktop()) return;
      const rect = mount.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inside) {
        mousePresent     = false;
        mouseJustEntered = false;
        return;
      }
      mouse.set(
        e.clientX - rect.left - width / 2,
        -(e.clientY - rect.top - height / 2),
      );
      if (!mousePresent) mouseJustEntered = true;
      mousePresent = true;
    };

    const onLeave = () => {
      mousePresent     = false;
      mouseJustEntered = false;
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    const onTouch = (e: TouchEvent) => {
      if (!isDesktop()) return;
      const t    = e.touches[0];
      const rect = mount.getBoundingClientRect();
      mouse.set(
        t.clientX - rect.left - width / 2,
        -(t.clientY - rect.top - height / 2),
      );
      if (!mousePresent) mouseJustEntered = true;
      mousePresent = true;
    };

    const onTouchEnd = () => {
      if (!isDesktop()) return;
      mousePresent     = false;
      mouseJustEntered = false;
    };

    mount.addEventListener("touchmove", onTouch,      { passive: true });
    mount.addEventListener("touchend",  onTouchEnd);

    // Grid Layout

    let cols: number, rows: number, actualCount: number, spacingX: number, spacingY: number;

    if (gridGap > 0) {
      // Explicit grid: cells are gridGap pixels apart
      cols        = Math.max(1, Math.floor(width  / gridGap));
      rows        = Math.max(1, Math.floor(height / gridGap));
      actualCount = cols * rows;
      spacingX = spacingY = gridGap;
    } else {
      // Auto grid: fit particleCount evenly, respecting aspect ratio
      actualCount  = particleCount;
      const aspect = width / height;
      rows    = Math.max(1, Math.round(Math.sqrt(actualCount / aspect)));
      cols    = Math.ceil(actualCount / rows);
      spacingX = width  / cols;
      spacingY = height / rows;
    }

    const positions = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      positions[i * 3]     = (c + 0.5) * spacingX - width  / 2;
      positions[i * 3 + 1] = (r + 0.5) * spacingY - height / 2;
      positions[i * 3 + 2] = 0;
    }

    //  Particle Points

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:          { value: _particleColor },
        uGlow:           { value: _glowColor },
        uSize:           { value: particleSize * Math.min(window.devicePixelRatio, 2) },
        uMouse:          { value: new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN) },
        uSpotlightRadius: { value: spotlightRadius },
        uGlowEnabled:    { value: particlesGlow },
        uAlpha:          { value: 0.0 },
      },
      vertexShader:   PARTICLE_VERT,
      fragmentShader: POINT_FRAG,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Cursor Dot

    const cursorGeo = new THREE.BufferGeometry();
    cursorGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );

    const cursorMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:       { value: _centerColor },
        uGlow:        { value: _glowColor },
        uSize:        { value: particleSize * Math.min(window.devicePixelRatio, 2) },
        uGlowEnabled: { value: particlesGlow },
        uAlpha:       { value: 0.0 },
      },
      vertexShader:   CURSOR_VERT,
      fragmentShader: POINT_FRAG,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const cursorPoint = new THREE.Points(cursorGeo, cursorMat);
    scene.add(cursorPoint);

    //Web Lines
    const mouseLinePositions = new Float32Array(actualCount * 6);
    const mouseLineColors    = new Float32Array(actualCount * 6);

    const mouseLineGeo = new THREE.BufferGeometry();
    mouseLineGeo.setAttribute("position", new THREE.BufferAttribute(mouseLinePositions, 3));
    mouseLineGeo.setAttribute("color",    new THREE.BufferAttribute(mouseLineColors,    3));

    const mouseLineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      1,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
    });

    const mouseLines = new THREE.LineSegments(mouseLineGeo, mouseLineMat);
    scene.add(mouseLines);

    // Resize

    const onResize = () => {
      width  = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.left   = -width  / 2;
      camera.right  =  width  / 2;
      camera.top    =  height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const reduceMotionMq = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    );
    const onReduceMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
    };
    reduceMotionMq?.addEventListener?.("change", onReduceMotionChange);

    //  Animation Loop

    const loop = createSuspendedRaf({
      root: mount,
      onFrame: () => {

      const lerpSpeed   = reduceMotion ? LERP_SPEED * REDUCED_MOTION_FACTOR       : LERP_SPEED;
      const fadeSpeed   = reduceMotion ? FADE_SPEED * REDUCED_MOTION_FACTOR       : FADE_SPEED;
      const spotlightR  = reduceMotion ? spotlightRadius * REDUCED_MOTION_FACTOR  : spotlightRadius;
      const connectDist = reduceMotion ? mouseConnectDist * REDUCED_MOTION_FACTOR : mouseConnectDist;

      // Fade the entire effect in/out as cursor enters or leaves
      mouseEntryAlpha = mousePresent
        ? Math.min(1, mouseEntryAlpha + fadeSpeed)
        : Math.max(0, mouseEntryAlpha - fadeSpeed);

      // Snap smoothMouse on the first frame, lerp every frame after
      if (mousePresent && mouse.x > MOUSE_THRESHOLD) {
        if (mouseJustEntered) {
          smoothMouse.copy(mouse); // instant snap - avoids lerp drift from previous position
          mouseJustEntered = false;
        } else {
          smoothMouse.x += (mouse.x - smoothMouse.x) * lerpSpeed;
          smoothMouse.y += (mouse.y - smoothMouse.y) * lerpSpeed;
        }
      } else if (!mousePresent && mouseEntryAlpha <= 0) {
        smoothMouse.set(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
      }

      // Sync uniforms
      particleMat.uniforms.uMouse.value.copy(smoothMouse);
      particleMat.uniforms.uAlpha.value = mouseEntryAlpha;
      cursorMat.uniforms.uAlpha.value   = mouseEntryAlpha;
      particleMat.uniforms.uSpotlightRadius.value = spotlightR;

      // Move cursor dot
      if (smoothMouse.x > MOUSE_THRESHOLD) {
        cursorPoint.position.set(smoothMouse.x, smoothMouse.y, 0);
        cursorPoint.visible = true;
      } else {
        cursorPoint.visible = false;
      }

      // Build web lines - one segment per nearby particle
      let mIdx = 0;

      if (showWeb && smoothMouse.x > MOUSE_THRESHOLD && mouseEntryAlpha > 0) {
        for (let i = 0; i < actualCount; i++) {
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const dx = px - smoothMouse.x;
          const dy = py - smoothMouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);

          if (d >= connectDist) continue; // outside web radius, skip

          const alpha = (1 - d / connectDist) * 0.85 * mouseEntryAlpha;
          const si    = mIdx * 6;

          // Line start = cursor position
          mouseLinePositions[si]     = smoothMouse.x;
          mouseLinePositions[si + 1] = smoothMouse.y;
          mouseLinePositions[si + 2] = 0;

          // Line end = particle position
          mouseLinePositions[si + 3] = px;
          mouseLinePositions[si + 4] = py;
          mouseLinePositions[si + 5] = 0;

          // Alpha is encoded per-vertex in RGB (additive blending, no real alpha channel)
          mouseLineColors[si]     = _webColor.r;
          mouseLineColors[si + 1] = _webColor.g;
          mouseLineColors[si + 2] = _webColor.b;
          mouseLineColors[si + 3] = _webColor.r * alpha;
          mouseLineColors[si + 4] = _webColor.g * alpha;
          mouseLineColors[si + 5] = _webColor.b * alpha;

          mIdx++;
        }
      }

      mouseLineGeo.setDrawRange(0, mIdx * 2);
      mouseLineGeo.attributes.position.needsUpdate = true;
      mouseLineGeo.attributes.color.needsUpdate    = true;

      renderer.render(scene, camera);
      },
    });

    loop.start();

    //  Cleanup

    return () => {
      reduceMotionMq?.removeEventListener?.("change", onReduceMotionChange);
      loop.destroy();
      window.removeEventListener("resize", onResize);
      if (mount) {
        window.removeEventListener("mousemove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        mount.removeEventListener("touchmove",  onTouch);
        mount.removeEventListener("touchend",   onTouchEnd);
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      cursorGeo.dispose();
      cursorMat.dispose();
      mouseLineGeo.dispose();
      mouseLineMat.dispose();
    };
  }, [
    particleCount,
    gridGap,
    particleSize,
    mouseConnectDist,
    spotlightRadius,
    showWeb,
    particlesGlow,
    glowColor,
    particleColor,
    webColor,
    centerColor,
  ]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
    />
  );
}
