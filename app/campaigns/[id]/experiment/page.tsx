"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Lock, BarChart3, AlertCircle, Upload, CheckCircle2, FlaskConical, Link2 } from "lucide-react";
import Link from "next/link";

export default function ExperimentPlannerPage() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/campaigns/123/creators" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Experiment Planner (A/B Test)</h1>
            <p className="text-xs text-neutral-500">South India Diwali Push</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isLocked ? (
            <Button variant="primary" size="sm" onClick={() => setIsLocked(true)} iconRight={<Lock size={14}/>}>
              Pre-Register & Lock
            </Button>
          ) : (
            <Link href="/campaigns/123/analytics">
              <Button variant="primary" size="sm" iconRight={<Upload size={14}/>}>
                Import Data & Analyze
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-6">
        
        {isLocked && (
          <div className="bg-sage/20 border border-sage-300 rounded-xl p-4 flex items-start gap-3 mb-8 animate-fade-in">
            <Lock size={20} className="text-forest shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-forest">Experiment Locked</h3>
              <p className="text-xs text-neutral-700 mt-1">Hypothesis, metrics, and variants are now frozen. This prevents after-the-fact metric picking. You can now import campaign data for analysis.</p>
            </div>
          </div>
        )}

        <div className={`space-y-8 ${isLocked ? 'opacity-80 pointer-events-none' : ''}`}>
          
          <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-graphite mb-4 flex items-center gap-2">
              <FlaskConical size={18} className="text-forest" />
              1. Hypothesis & Variants
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1.5">Hypothesis</label>
                <textarea 
                  rows={2} 
                  defaultValue="Using modern urban slang (Variant B) will drive a higher Click-Through Rate than traditional festive phrasing (Variant A) among young adults in Hyderabad." 
                  className="w-full text-sm p-3 rounded-lg border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                  <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-2">Variant A (Control)</span>
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 size={14} className="text-neutral-400"/>
                    <span className="text-xs text-graphite font-mono">asset-v-001 (Approved)</span>
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">పండుగ సీజన్‌లో మీ కుటుంబ ఆరోగ్యానికి సరైన కానుక...</p>
                </div>
                <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                  <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-2">Variant B (Test)</span>
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 size={14} className="text-neutral-400"/>
                    <span className="text-xs text-graphite font-mono">asset-v-003 (Approved)</span>
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్...</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg text-xs">
                <CheckCircle2 size={16} className="shrink-0" />
                <p>System Check: Both variants are approved, share the same language (Telugu), region, and channel. A/B testing is permitted.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-graphite mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-forest" />
              2. Measurement Plan
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1.5">Primary Success Metric (Locked)</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-forest/15 text-sm focus:outline-none focus:ring-1 focus:ring-forest">
                    <option>Click-Through Rate (CTR)</option>
                    <option>Conversion Rate</option>
                    <option>Engagement Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1.5">Attribution Window</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-forest/15 text-sm focus:outline-none focus:ring-1 focus:ring-forest">
                    <option>7-day click</option>
                    <option>1-day click</option>
                    <option>28-day click, 1-day view</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1.5">Assignment Method</label>
                <select className="w-full h-10 px-3 rounded-lg border border-forest/15 text-sm focus:outline-none focus:ring-1 focus:ring-forest">
                  <option>Randomized (Platform A/B tool)</option>
                  <option>Sequential</option>
                  <option>Geographic split (Pseudo-random)</option>
                </select>
              </div>
              
              <div className="border-t border-forest/10 pt-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-brass mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-graphite">Planning Estimate</h4>
                    <p className="text-xs text-neutral-600 mt-1">To detect a 5% relative lift in CTR with 95% confidence, you will need a minimum of <span className="font-semibold text-brass-700 bg-brass/10 px-1 rounded">2,500 impressions</span> per variant. This is a predicted estimate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
