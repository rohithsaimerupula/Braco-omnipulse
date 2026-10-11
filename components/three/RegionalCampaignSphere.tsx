"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RealisticWorldGlobe } from "./RealisticWorldGlobe";
import { IndiaStateMap } from "./IndiaStateMap";
import { ShieldCheck, Sparkles } from "lucide-react";

interface RegionalCampaignSphereProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  onModeChange?: (mode: "globe" | "india_map") => void;
}

// Static SVG fallback for reduced-motion and non-WebGL environments
export function SphereFallback({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-md opacity-90"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <radialGradient id="sphereGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#DCE5D9" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#183B2B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#183B2B" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id="rimLight" cx="80%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#B39A67" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B39A67" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="175" fill="url(#rimLight)" />
        <circle cx="200" cy="200" r="150" fill="url(#sphereGrad)" stroke="#183B2B" strokeWidth="0.5" strokeOpacity="0.15" />
        <ellipse cx="200" cy="200" rx="150" ry="38" fill="none" stroke="#B39A67" strokeWidth="1" strokeOpacity="0.30" />
      </svg>
    </div>
  );
}

// Interactive Realistic Globe with India Highlight & India Linguistic State Map
export function RegionalCampaignSphere({
  className,
  size = 460,
  interactive = true,
  onModeChange,
}: RegionalCampaignSphereProps) {
  const [viewMode, setViewMode] = useState<"globe" | "india_map">("globe");

  const handleSelectIndia = () => {
    setViewMode("india_map");
    onModeChange?.("india_map");
  };

  const handleBackToGlobe = () => {
    setViewMode("globe");
    onModeChange?.("globe");
  };

  return (
    <div className={cn("relative w-full flex items-center justify-center transition-all duration-500", className)}>
      {viewMode === "globe" ? (
        <div className="relative flex items-center justify-center animate-fade-in w-full max-w-[500px]">
          {/* Orbital Halo rings */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-brass/15 animate-spin-slow pointer-events-none" />
          <div className="absolute w-[380px] h-[380px] rounded-full border border-forest/8 pointer-events-none" />

          {/* Realistic 3D Globe */}
          <RealisticWorldGlobe
            size={size}
            interactive={interactive}
            onSelectIndia={handleSelectIndia}
            onNonIndiaClick={() => {
              // Non-India click handling: does not show any map as requested
            }}
          />

          {/* Floating label chips (from reference design) */}
          <div
            onClick={handleSelectIndia}
            className="absolute top-8 left-0 sm:left-4 bg-white/95 backdrop-blur-xs rounded-lg px-3 py-2 shadow-editorial border border-forest/8 flex items-center gap-2 text-xs cursor-pointer hover:border-brass hover:scale-105 transition-all z-10"
            title="Click to explore Telugu in Andhra & Telangana"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-forest font-medium">తెలుగు campaign live</span>
          </div>

          <div className="absolute bottom-8 right-0 sm:right-4 bg-white/95 backdrop-blur-xs rounded-lg px-3 py-2 shadow-editorial border border-forest/8 flex items-center gap-2 text-xs pointer-events-none z-10">
            <ShieldCheck size={12} className="text-brass" />
            <span className="text-forest font-medium">Brand safety: Passed</span>
          </div>

          <div
            onClick={handleSelectIndia}
            className="absolute top-1/2 -right-2 sm:right-0 bg-forest text-ivory rounded-lg px-3 py-2 shadow-editorial text-xs font-medium cursor-pointer hover:bg-forest/90 hover:scale-105 transition-all z-10"
            title="Click to explore Tamil in Tamil Nadu"
          >
            Tamil variant ready
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl animate-fade-in z-20">
          <IndiaStateMap onBackToGlobe={handleBackToGlobe} />
        </div>
      )}
    </div>
  );
}
