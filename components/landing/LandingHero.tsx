"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Globe2, ArrowRight, Play, Sparkles } from "lucide-react";
import { RealisticWorldGlobe } from "@/components/three/RealisticWorldGlobe";
import { IndiaStateMap } from "@/components/three/IndiaStateMap";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-5 rounded-lg bg-white/60 border border-forest/8 shadow-2xs">
      <div className="font-serif text-3xl font-semibold text-forest mb-1">{value}</div>
      <div className="text-xs text-neutral-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export function LandingHero() {
  const [viewMode, setViewMode] = useState<"globe" | "india_map">("globe");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-ivory"
      aria-labelledby="hero-headline"
    >
      {/* Subtle background luxury texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-sage/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-brass/5 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {viewMode === "globe" ? (
          /* ── STANDARD TWO-COLUMN HERO (COPY + 3D GLOBE) ──────── */
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-fade-in">
            {/* Left: copy */}
            <div className="animate-fade-up">
              <div className="tag-editorial mb-4 inline-flex items-center gap-1.5">
                <Globe2 size={12} className="text-brass" />
                <span>Regional Language Quality Engine • Sections 1–8 Live</span>
              </div>

              <h1
                id="hero-headline"
                className="font-serif text-5xl lg:text-display-md font-semibold text-forest leading-tight text-balance mb-5"
              >
                Every market has its{" "}
                <span className="italic text-gradient-brass">own language &amp; dialect.</span>
              </h1>

              <p className="text-base lg:text-lg text-graphite/75 leading-relaxed mb-6 max-w-lg text-balance">
                11-field regional configuration, Coastal Andhra vs. Telangana vs. Neutral Telugu adaptation, A–H translation comparison, 7-point Complete-Copy Brand Guardian, and honest evaluation statuses—with zero unrequested festivals or guarantees.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} />}>
                    Open Sections 1–8 Command Center
                  </Button>
                </Link>
                <Link href="/campaigns/greenglow-small-daily-choices-greener-living/studio">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<Play size={14} className="fill-forest/60" />}
                  >
                    GreenGlow A–H Studio
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard value="11 Fields" label="Regional Config (Sec 1)" />
                <StatCard value="A–H" label="Translation Diff (Sec 5)" />
                <StatCard value="12/12" label="Regression Suite (Sec 7)" />
              </div>
            </div>

            {/* Right: Photorealistic 3D Globe */}
            <div className="relative flex items-center justify-center animate-fade-in">
              {/* Orbital Halo rings */}
              <div className="absolute w-[440px] h-[440px] rounded-full border border-brass/15 animate-spin-slow pointer-events-none" />
              <div className="absolute w-[380px] h-[380px] rounded-full border border-forest/8 pointer-events-none" />

              <RealisticWorldGlobe
                size={460}
                interactive
                onSelectIndia={() => setViewMode("india_map")}
              />

              {/* Floating label badges */}
              <div
                onClick={() => setViewMode("india_map")}
                className="absolute top-4 left-0 sm:left-4 bg-white/95 backdrop-blur-xs rounded-lg px-3 py-2 shadow-editorial border border-forest/8 flex items-center gap-2 text-xs cursor-pointer hover:border-brass hover:scale-105 transition-all z-20"
                title="Click to view Telugu linguistic intelligence"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-forest font-medium">తెలుగు campaign live</span>
              </div>

              <div className="absolute bottom-4 right-0 sm:right-4 bg-white/95 backdrop-blur-xs rounded-lg px-3 py-2 shadow-editorial border border-forest/8 flex items-center gap-2 text-xs pointer-events-none z-20">
                <Sparkles size={12} className="text-brass" />
                <span className="text-forest font-medium">Brand safety: Passed</span>
              </div>

              <div
                onClick={() => setViewMode("india_map")}
                className="absolute top-1/2 -right-2 sm:-right-4 bg-forest text-ivory rounded-lg px-3 py-2 shadow-editorial text-xs font-medium cursor-pointer hover:bg-forest/90 hover:scale-105 transition-all z-20"
                title="Click to view Tamil linguistic intelligence"
              >
                Tamil variant ready
              </div>
            </div>
          </div>
        ) : (
          /* ── FULL-WIDTH STRUCTURED REGIONAL INTELLIGENCE DASHBOARD ─ */
          <div className="w-full animate-fade-in">
            <IndiaStateMap onBackToGlobe={() => setViewMode("globe")} />
          </div>
        )}
      </div>

      {/* Scroll indicator (only in globe view) */}
      {viewMode === "globe" && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
          <span className="text-2xs uppercase tracking-widest text-graphite">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-graphite/30 to-transparent" />
        </div>
      )}
    </section>
  );
}
