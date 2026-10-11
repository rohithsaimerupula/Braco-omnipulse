"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { INDIA_STATES_DATA, IndiaState } from "./indiaStatesData";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  Languages,
} from "lucide-react";

interface IndiaStateMapProps {
  className?: string;
  onBackToGlobe: () => void;
  initialStateId?: string;
}

export function IndiaStateMap({
  className,
  onBackToGlobe,
  initialStateId = "andhra_pradesh",
}: IndiaStateMapProps) {
  const [selectedStateId, setSelectedStateId] = useState<string>(initialStateId);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = ["All", "South", "West", "North", "East", "Central", "North-East"] as const;

  // Filter states based on search query and region
  const filteredStates = useMemo(() => {
    return INDIA_STATES_DATA.filter((state) => {
      const matchesRegion = selectedRegion === "All" || state.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesRegion;

      const matchesSearch =
        state.name.toLowerCase().includes(q) ||
        state.motherTongue.name.toLowerCase().includes(q) ||
        state.motherTongue.nativeScript.includes(q) ||
        state.capital.toLowerCase().includes(q);

      return matchesRegion && matchesSearch;
    });
  }, [searchQuery, selectedRegion]);

  const activeState = useMemo(() => {
    return (
      INDIA_STATES_DATA.find((s) => s.id === (hoveredStateId || selectedStateId)) ||
      INDIA_STATES_DATA[0]
    );
  }, [hoveredStateId, selectedStateId]);

  return (
    <div
      className={cn(
        "relative w-full max-w-7xl mx-auto bg-[#FAF7F2] rounded-3xl border border-forest/12 p-5 sm:p-7 shadow-editorial-lg transition-all",
        className
      )}
    >
      {/* ── TOP HEADER & CONTROLS ──────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-forest/8">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToGlobe}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-forest text-ivory hover:bg-forest/90 transition-all shadow-xs group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to World Globe</span>
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-forest">
                India Linguistic State Map
              </h2>
              <span className="text-2xs uppercase tracking-wider font-mono bg-brass/15 text-forest px-2.5 py-0.5 rounded-full font-semibold">
                28 States · 22+ Languages
              </span>
            </div>
            <p className="text-xs text-graphite/60 hidden sm:block">
              Interactive Survey of India boundaries · Click any state to inspect mother tongue & marketing nuances
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Search state, script or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-forest/12 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass placeholder:text-graphite/40 shadow-2xs"
          />
        </div>
      </div>

      {/* ── REGIONAL FILTER PILLS ───────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none text-xs">
        <span className="text-graphite/50 font-medium text-2xs uppercase tracking-wider shrink-0 mr-1">
          Filter Region:
        </span>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              selectedRegion === region
                ? "bg-forest text-ivory shadow-xs font-semibold"
                : "bg-white/90 text-forest/75 hover:bg-white border border-forest/8"
            )}
          >
            {region}
            {region !== "All" && (
              <span className="ml-1 opacity-60 text-2xs">
                ({INDIA_STATES_DATA.filter((s) => s.region === region).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── BALANCED TWO-COLUMN DASHBOARD (MAP + INSPECTOR) ──── */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Official Survey of India SVG Map (7 Columns) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center bg-white/90 rounded-2xl p-4 border border-forest/8 shadow-xs min-h-[500px]">
          <div className="relative w-full aspect-[640/700] max-h-[520px]">
            <svg
              viewBox="0 0 640 700"
              className="w-full h-full filter drop-shadow-sm"
              aria-label="Official Survey of India Map with States"
            >
              <defs>
                <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#9C7A28" />
                </linearGradient>
              </defs>

              {/* Background ambient ring */}
              <circle
                cx="320"
                cy="350"
                r="310"
                fill="none"
                stroke="#B39A67"
                strokeWidth="0.6"
                strokeOpacity="0.12"
                strokeDasharray="4 6"
              />

              {/* Render all state paths */}
              {INDIA_STATES_DATA.map((state) => {
                const isSelected = selectedStateId === state.id;
                const isHovered = hoveredStateId === state.id;
                const isMatching = filteredStates.some((s) => s.id === state.id);

                return (
                  <g
                    key={state.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedStateId(state.id)}
                    onMouseEnter={() => setHoveredStateId(state.id)}
                    onMouseLeave={() => setHoveredStateId(null)}
                  >
                    <path
                      d={state.path}
                      fill={
                        isSelected
                          ? "url(#activeGrad)"
                          : isHovered
                          ? "#2D6A4F"
                          : isMatching
                          ? "#3A6E53"
                          : "#D8D0C0"
                      }
                      fillOpacity={
                        isSelected ? 0.95 : isHovered ? 0.9 : isMatching ? 0.32 : 0.12
                      }
                      stroke={isSelected ? "#B39A67" : isHovered ? "#2D6A4F" : "#183B2B"}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 0.8}
                      strokeOpacity={isSelected ? 1 : isHovered ? 0.9 : 0.35}
                      className="transition-colors duration-200"
                      filter={isSelected ? "url(#activeGlow)" : undefined}
                    />

                    {/* Centroid marker */}
                    <circle
                      cx={state.center.x}
                      cy={state.center.y}
                      r={isSelected ? 4 : isHovered ? 3.5 : 2}
                      fill={isSelected ? "#FFFFFF" : isHovered ? "#D4AF37" : "#183B2B"}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      opacity={isMatching ? 0.9 : 0.4}
                    />

                    {/* Label floating above active/hovered state */}
                    {(isSelected || isHovered) && (
                      <g>
                        <rect
                          x={state.center.x - 42}
                          y={state.center.y - 24}
                          width="84"
                          height="18"
                          rx="4"
                          fill="#183B2B"
                          opacity="0.94"
                        />
                        <text
                          x={state.center.x}
                          y={state.center.y - 12}
                          textAnchor="middle"
                          fill="#FAF7F2"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {state.motherTongue.nativeScript}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom map indicator */}
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-forest/10 shadow-xs flex items-center gap-2 text-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-forest font-medium">Click any state to view details</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Structured State Profile & Linguistic Card (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl p-5 sm:p-6 border border-forest/10 shadow-editorial">
          <div>
            {/* Header: Name, Native Name & Live Campaigns */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-brass bg-brass/10 px-2.5 py-0.5 rounded-md">
                    {activeState.region} Region
                  </span>
                  <span className="text-2xs text-graphite/50 font-medium">
                    Capital: {activeState.capital}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest leading-tight">
                  {activeState.name}
                </h3>
                <span className="text-xs text-graphite/60 font-serif italic">
                  {activeState.nativeName}
                </span>
              </div>

              <div className="bg-forest/5 rounded-xl px-3 py-1.5 text-center shrink-0 border border-forest/8">
                <span className="block text-3xs text-graphite/60 uppercase tracking-wide">
                  Campaigns
                </span>
                <span className="font-serif text-base font-bold text-forest">
                  {activeState.activeCampaigns} Live
                </span>
              </div>
            </div>

            {/* ── MOTHER TONGUE HERO BANNER ──────────────── */}
            <div className="bg-gradient-to-r from-forest to-forest/90 text-ivory rounded-xl p-4 mb-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-3 -bottom-3 text-7xl font-serif font-black opacity-10 select-none pointer-events-none">
                {activeState.motherTongue.nativeScript}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xs text-brass uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <Languages size={12} />
                    Primary Mother Tongue
                  </span>
                  <span className="text-2xs bg-brass/25 text-brass px-2 py-0.5 rounded-full font-mono font-bold">
                    {activeState.motherTongue.speakersPercentage} Spoken
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-1">
                  <span className="text-xl font-serif font-semibold text-ivory">
                    {activeState.motherTongue.name}
                  </span>
                  <span className="font-serif text-2xl text-brass font-bold">
                    {activeState.motherTongue.nativeScript}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-2xs text-ivory/80 mt-2 pt-2 border-t border-ivory/15">
                  <span className="flex items-center gap-1">
                    <Users size={11} className="text-brass" />
                    <span>{activeState.motherTongue.speakers}</span>
                  </span>
                  <span>•</span>
                  <span>{activeState.motherTongue.family}</span>
                </div>
              </div>
            </div>

            {/* ── 2-COLUMN STRUCTURED DETAILS ─────────────── */}
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {/* Native Cultural Greeting */}
              <div className="p-3 rounded-xl bg-ivory border border-forest/8">
                <div className="text-3xs text-graphite/50 uppercase tracking-wider mb-1 font-semibold">
                  Native Greeting ({activeState.greeting.phonetic})
                </div>
                <div className="font-serif text-base font-bold text-forest mb-0.5">
                  {activeState.greeting.phrase}
                </div>
                <div className="text-2xs text-graphite/70 line-clamp-2">
                  {activeState.greeting.meaning}
                </div>
              </div>

              {/* Other Spoken Regional Languages */}
              <div className="p-3 rounded-xl bg-white border border-forest/8">
                <div className="text-3xs text-graphite/50 uppercase tracking-wider mb-1 font-semibold">
                  Other Languages
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeState.otherLanguages.slice(0, 3).map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 text-3xs rounded-md bg-forest/5 text-forest font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cultural Marketing Nuance */}
            <div className="p-3.5 rounded-xl bg-brass/10 border border-brass/20 mb-4">
              <div className="flex items-center gap-1.5 text-2xs font-bold text-forest uppercase tracking-wider mb-1">
                <Sparkles size={11} className="text-brass" />
                <span>Regional Campaign Nuance</span>
              </div>
              <p className="text-xs text-graphite/85 leading-relaxed line-clamp-3">
                {activeState.culturalInsight}
              </p>
            </div>

            {/* Key Festivals */}
            <div className="mb-4">
              <span className="text-3xs text-graphite/50 uppercase tracking-wider font-semibold block mb-1.5 flex items-center gap-1">
                <Calendar size={10} className="text-forest/60" />
                Key Activation Windows:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeState.topFestivals.map((fest, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-2xs rounded-lg bg-ivory border border-forest/8 text-graphite/80 font-medium"
                  >
                    🎉 {fest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3 border-t border-forest/8 flex flex-col sm:flex-row gap-2">
            <a
              href="/campaigns/new"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest text-ivory text-xs font-semibold hover:bg-forest/90 transition-all shadow-xs"
            >
              <span>Launch {activeState.motherTongue.name} Campaign</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="/dashboard"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-brass/15 text-forest text-xs font-semibold hover:bg-brass/25 transition-all"
            >
              <span>Sections 1–8 Hub</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── STATE QUICK-SELECT PILLS GRID ───────────────────── */}
      <div className="mt-6 pt-4 border-t border-forest/8">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-serif font-semibold text-forest">
            Explore All 30 Regional States & Native Scripts:
          </span>
          <span className="text-2xs text-graphite/50 font-medium">
            Showing {filteredStates.length} states
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {filteredStates.map((state) => {
            const isSelected = selectedStateId === state.id;
            return (
              <button
                key={state.id}
                onClick={() => setSelectedStateId(state.id)}
                className={cn(
                  "px-2.5 py-1 text-2xs rounded-lg font-medium transition-all flex items-center gap-1.5 border",
                  isSelected
                    ? "bg-forest text-ivory border-forest shadow-xs font-semibold"
                    : "bg-white text-forest/80 border-forest/8 hover:border-forest/25 hover:bg-white"
                )}
              >
                <span>{state.name}</span>
                <span
                  className={cn(
                    "px-1 rounded text-3xs font-serif",
                    isSelected ? "bg-brass text-ivory" : "bg-forest/5 text-brass font-bold"
                  )}
                >
                  {state.motherTongue.nativeScript}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
