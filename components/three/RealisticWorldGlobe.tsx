"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { Compass, RotateCw, Sparkles, MapPin } from "lucide-react";

interface RealisticWorldGlobeProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  onSelectIndia: () => void;
  onNonIndiaClick?: (name?: string) => void;
}

export function RealisticWorldGlobe({
  className,
  size = 480,
  interactive = true,
  onSelectIndia,
  onNonIndiaClick,
}: RealisticWorldGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    globeMesh: THREE.Mesh;
    atmosphereMesh: THREE.Mesh;
    indiaGroup: THREE.Group;
    pulseRings: THREE.Mesh[];
  } | null>(null);

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    hasMoved: false,
  });

  const rotationRef = useRef({
    // Initial rotation orienting the Indian subcontinent directly front & center
    // Calculated for Three.js sphere UV texture mapping
    rotX: 0.40,
    rotY: -2.94,
    targetRotX: 0.40,
    targetRotY: -2.94,
    velX: 0,
    velY: 0.0018, // ambient rotation drift
  });

  const [hoveredIndia, setHoveredIndia] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [indiaScreenPos, setIndiaScreenPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: true,
  });

  // Spherical coordinate helper: Convert Lat/Lon to exact Three.js SphereGeometry coordinates
  // Matches equirectangular NASA texture mapping (u: lon -180..+180, v: lat -90..+90)
  const latLonToVector3 = useCallback((latDeg: number, lonDeg: number, radius: number) => {
    const u = (lonDeg + 180) / 360;
    const v = (latDeg + 90) / 180;
    const phi = u * 2 * Math.PI;
    const theta = (1 - v) * Math.PI;

    const x = -radius * Math.cos(phi) * Math.sin(theta);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Three.js Scene, Camera, Renderer ─────────────────
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // ── 2. Lighting ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(150, 90, 180);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xb39a67, 0.7);
    rimLight.position.set(-150, -80, -100);
    scene.add(rimLight);

    // ── 3. Photorealistic Earth Sphere ───────────────────────
    const GLOBE_RADIUS = 76;
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/textures/earth.jpg");
    const specularTexture = textureLoader.load("/textures/earth_specular.jpg");

    const globeMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specularMap: specularTexture,
      specular: new THREE.Color(0x355a40),
      shininess: 22,
      emissive: new THREE.Color(0x0a1610),
      emissiveIntensity: 0.12,
    });

    const globeMesh = new THREE.Mesh(sphereGeo, globeMat);
    scene.add(globeMesh);

    // ── 4. Atmospheric Glow Shell ────────────────────────────
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const atmoMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0xb39a67) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(glowColor, intensity * 0.45);
        }
      `,
    });
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphereMesh);

    // ── 5. India Highlight 3D Beacon & Radar Rings ───────────
    const indiaGroup = new THREE.Group();
    // India geographic center: Lat 22.5° N, Lon 78.9° E
    const indiaLocalPos = latLonToVector3(22.5, 78.9, GLOBE_RADIUS);
    indiaGroup.position.copy(indiaLocalPos);
    // Orient marker outward perpendicular to sphere surface
    indiaGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), indiaLocalPos.clone().normalize());

    // Glowing core pin
    const pinGeo = new THREE.SphereGeometry(2.6, 24, 24);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.z = 1.0;
    indiaGroup.add(pinMesh);

    // Inner bright center dot
    const coreGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.z = 2.4;
    indiaGroup.add(coreMesh);

    // Outer pulsating concentric rings
    const pulseRings: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(3.5, 4.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xb39a67,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0.5;
      indiaGroup.add(ringMesh);
      pulseRings.push(ringMesh);
    }

    globeMesh.add(indiaGroup);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      globeMesh,
      atmosphereMesh,
      indiaGroup,
      pulseRings,
    };

    // ── 6. Animation Loop ────────────────────────────────────
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Ambient drift when user is not actively dragging
      if (!dragRef.current.isDragging) {
        rotationRef.current.targetRotY += rotationRef.current.velY;
      }

      // Smooth interpolation / damping
      rotationRef.current.rotX += (rotationRef.current.targetRotX - rotationRef.current.rotX) * 0.12;
      rotationRef.current.rotY += (rotationRef.current.targetRotY - rotationRef.current.rotY) * 0.12;

      globeMesh.rotation.x = rotationRef.current.rotX;
      globeMesh.rotation.y = rotationRef.current.rotY;

      // Animate pulsing radar rings over India
      pulseRings.forEach((ring, idx) => {
        const progress = ((elapsedTime * 1.4) + idx * 0.33) % 1;
        const scale = 1 + progress * 4.0;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - progress) * 0.85);
      });

      // Project India's 3D position to 2D screen space
      const worldPos = new THREE.Vector3();
      indiaGroup.getWorldPosition(worldPos);
      const normal = worldPos.clone().normalize();
      const camNormal = camera.position.clone().normalize();
      const dot = normal.dot(camNormal);
      const isVisible = dot > 0.12; // In front hemisphere

      worldPos.project(camera);
      const screenX = ((worldPos.x + 1) * width) / 2;
      const screenY = ((-worldPos.y + 1) * height) / 2;

      setIndiaScreenPos({
        x: screenX,
        y: screenY,
        visible: isVisible,
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Resize Observer ───────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || size;
      const h = container.clientHeight || size;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      globeMat.dispose();
      earthTexture.dispose();
      specularTexture.dispose();
      sceneRef.current = null;
    };
  }, [size, latLonToVector3]);

  // Pointer Drag & Click Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (dragRef.current.isDragging) {
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;

      if (Math.hypot(e.clientX - dragRef.current.startX, e.clientY - dragRef.current.startY) > 6) {
        dragRef.current.hasMoved = true;
      }

      rotationRef.current.targetRotY += dx * 0.007;
      rotationRef.current.targetRotX += dy * 0.007;
      // Clamp pitch so poles don't flip upside down
      rotationRef.current.targetRotX = Math.max(-0.75, Math.min(0.85, rotationRef.current.targetRotX));

      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    }

    // Hit test proximity to India on screen
    if (indiaScreenPos.visible) {
      const dist = Math.hypot(mouseX - indiaScreenPos.x, mouseY - indiaScreenPos.y);
      const isNear = dist <= 46;
      if (isNear !== hoveredIndia) {
        setHoveredIndia(isNear);
      }
    } else {
      if (hoveredIndia) setHoveredIndia(false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDrag = dragRef.current.hasMoved;
    dragRef.current.isDragging = false;

    if (!wasDrag) {
      // User tapped/clicked on globe!
      const container = mountRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check distance to India
      if (indiaScreenPos.visible) {
        const dist = Math.hypot(mouseX - indiaScreenPos.x, mouseY - indiaScreenPos.y);
        if (dist <= 50) {
          // USER CLICKED INDIA!
          onSelectIndia();
          return;
        }
      }

      // User clicked outside of India (Africa, Europe, Americas, Oceans)
      // Requirement: "if we select any other than india then dont show any thing"
      if (onNonIndiaClick) onNonIndiaClick();
      setFeedbackNotice("Regional campaign intelligence is active for India. Click on India to explore state mother tongues.");
      setTimeout(() => setFeedbackNotice(null), 3500);
    }
  };

  const faceIndia = () => {
    rotationRef.current.targetRotX = 0.40;
    rotationRef.current.targetRotY = -2.94;
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none w-full max-w-full",
        className
      )}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { dragRef.current.isDragging = false; }}
        className={cn(
          "relative touch-none block mx-auto transition-transform duration-300",
          hoveredIndia ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
        )}
        aria-label="Photorealistic 3D Earth Globe — Click highlighted India to view official state mother tongues"
      />

      {/* Floating 3D Anchor Badge directly pinned over India */}
      {indiaScreenPos.visible && (
        <div
          onClick={onSelectIndia}
          style={{
            position: "absolute",
            left: `${indiaScreenPos.x}px`,
            top: `${indiaScreenPos.y - 32}px`,
            transform: "translate(-50%, -100%)",
          }}
          className={cn(
            "pointer-events-auto cursor-pointer z-30 transition-all duration-300",
            hoveredIndia ? "scale-108 shadow-editorial-lg" : "hover:scale-105 shadow-editorial"
          )}
        >
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brass/50 hover:border-brass transition-all whitespace-nowrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span className="text-xs font-semibold text-forest flex items-center gap-1.5">
              <span>🇮🇳 India</span>
              <span className="text-2xs text-brass font-medium uppercase tracking-wider bg-brass/15 px-1.5 py-0.5 rounded">
                Click to explore
              </span>
            </span>
          </div>
          {/* Needle indicator pointing to India's exact pin on globe */}
          <div className="w-2.5 h-2.5 bg-white rotate-45 mx-auto -mt-1.5 border-r border-b border-brass/40" />
        </div>
      )}

      {/* Interactive Controls Overlay at bottom */}
      <div className="flex items-center gap-2 mt-2 z-20">
        <button
          onClick={faceIndia}
          title="Center view on India"
          className="flex items-center gap-1.5 px-3 py-1 text-2xs font-semibold rounded-full bg-white/95 border border-forest/15 text-forest hover:bg-white shadow-xs transition-all"
        >
          <Compass size={12} className="text-brass" />
          <span>Face India</span>
        </button>
        <div className="flex items-center gap-1.5 text-2xs text-graphite/60 bg-white/85 px-3 py-1 rounded-full border border-forest/10 shadow-2xs">
          <RotateCw size={10} className="animate-spin-slow opacity-60" />
          <span>Drag to rotate earth</span>
        </div>
      </div>

      {/* Gentle notice when non-India region is clicked */}
      {feedbackNotice && (
        <div className="absolute bottom-12 max-w-xs mx-auto px-4 py-2.5 rounded-xl bg-forest text-ivory text-xs shadow-editorial-lg text-center animate-fade-in z-40 border border-brass/30">
          <p className="font-medium">{feedbackNotice}</p>
        </div>
      )}
    </div>
  );
}
