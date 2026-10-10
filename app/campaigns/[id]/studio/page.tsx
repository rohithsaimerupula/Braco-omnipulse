"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Wand2, Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegionalCreativeStudioPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 1500); // Simulate API call for the UI demo
  };

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Regional Creative Studio</h1>
            <p className="text-xs text-neutral-500">South India Diwali Push — Variant Generation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleGenerate} disabled={isGenerating || hasGenerated} icon={isGenerating ? undefined : <Wand2 size={14}/>}>
            {isGenerating ? "Generating Variants..." : hasGenerated ? "Regenerate All" : "Generate Variants"}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-6">
        
        {/* Source Brief Summary */}
        <div className="bg-white rounded-xl border border-forest/10 p-5 mb-8 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Campaign Brief v1</h3>
            <p className="text-sm text-graphite mb-1"><strong>Language:</strong> Telugu</p>
            <p className="text-sm text-graphite mb-1"><strong>Format:</strong> Short Video Caption</p>
            <p className="text-sm text-graphite"><strong>Objective:</strong> Drive awareness for the new family pack.</p>
          </div>
          <div className="bg-sage/10 rounded-lg p-4 flex-1 border border-sage-300/30">
            <h4 className="text-xs font-semibold text-forest mb-2">Locked Fact Layer (Claim Atoms)</h4>
            <div className="flex items-start gap-2 text-sm text-forest-700">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <p>"Rasa Oats provides 100% of your daily iron needs when consumed with milk."</p>
            </div>
          </div>
        </div>

        {/* Generated Variants */}
        {!hasGenerated && !isGenerating && (
          <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-brass/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-brass" size={28} />
            </div>
            <h2 className="font-serif text-xl text-forest mb-2">Ready to adapt</h2>
            <p className="text-sm text-neutral-500 max-w-md">
              The AI will read the brief, retrieve the approved Claim Atoms, and generate regionally-adapted creative variants.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-sage-200 border-t-forest rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-forest animate-pulse">Running Two-Layer Generation...</p>
          </div>
        )}

        {hasGenerated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            
            {/* Variant A */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-forest">Variant A: Health Routine</h3>
                <span className="text-xs text-neutral-400">ID: asset-v-001</span>
              </div>
              
              <div className="bg-white rounded-xl border border-forest/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Content Area */}
                <div className="p-6 pb-5">
                  {/* Style using Noto Sans Telugu for proper rendering */}
                  <p className="text-lg text-graphite mb-4 leading-relaxed" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                    పండుగ సీజన్‌లో మీ కుటుంబ ఆరోగ్యానికి సరైన కానుక. రుచికరమైన రసా ఓట్స్, ప్రతి ఉదయం పాలతో తీసుకుంటే మీ <span className="bg-brass/20 text-brass-700 font-medium px-1 rounded">100% రోజువారీ ఐరన్ అవసరాలను</span> తీరుస్తుంది. మీ రోగనిరోధక శక్తిని పెంచుకోండి!
                  </p>
                  
                  <div className="flex gap-2 mb-4 text-xs font-medium">
                    <span className="px-2 py-1 rounded bg-forest/5 text-forest">Telugu</span>
                    <span className="px-2 py-1 rounded bg-forest/5 text-forest">Short Video Caption</span>
                  </div>
                </div>

                {/* Adaptation Card */}
                <div className="bg-sage/10 border-t border-forest/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-forest mb-3 flex items-center gap-1.5">
                    <Info size={14} /> Regional Adaptation Card
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3 border border-forest/5">
                      <p className="text-xs font-semibold text-graphite mb-1">Creative Layer Changes</p>
                      <p className="text-xs text-neutral-600">
                        Added a cultural hook referencing the festival season ("పండుగ సీజన్‌లో"). Translated "delicious" to "రుచికరమైన" for natural flow.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded p-3 border border-forest/5">
                      <p className="text-xs font-semibold text-graphite mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-green-600" /> Fact Layer Integrity
                      </p>
                      <p className="text-xs text-neutral-600">
                        Atom atom-101 intact. Locked tokens preserved exactly: <strong>100%</strong>, <strong>రోజువారీ ఐరన్</strong> (daily iron), <strong>పాలతో</strong> (with milk).
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    <Button variant="outline" size="sm" fullWidth>Edit text</Button>
                    <Link href="/campaigns/123/guardian" className="w-full">
                      <Button variant="primary" size="sm" fullWidth iconRight={<ChevronRight size={14}/>}>
                        Run Brand Guardian
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Variant B */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-forest">Variant B: Modern Lifestyle</h3>
                <span className="text-xs text-neutral-400">ID: asset-v-002</span>
              </div>
              
              <div className="bg-white rounded-xl border border-forest/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                <div className="p-6 pb-5">
                  <p className="text-lg text-graphite mb-4 leading-relaxed" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                    ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ <span className="bg-brass/20 text-brass-700 font-medium px-1 rounded">100% రోజువారీ ఐరన్ అవసరాలను</span> ఖచ్చితంగా తీరుస్తుంది. ఫలితాలు గ్యారెంటీ!
                  </p>
                  <div className="flex gap-2 mb-4 text-xs font-medium">
                    <span className="px-2 py-1 rounded bg-forest/5 text-forest">Telugu</span>
                    <span className="px-2 py-1 rounded bg-forest/5 text-forest">Short Video Caption</span>
                  </div>
                </div>

                <div className="bg-sage/10 border-t border-forest/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-forest mb-3 flex items-center gap-1.5">
                    <Info size={14} /> Regional Adaptation Card
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3 border border-forest/5">
                      <p className="text-xs font-semibold text-graphite mb-1">Creative Layer Changes</p>
                      <p className="text-xs text-neutral-600">
                        Used modern urban slang ("బిజీ లైఫ్‌", "యాక్టివ్‌గా") to appeal to younger demographics in metros like Hyderabad.
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-forest/5">
                      <p className="text-xs font-semibold text-graphite mb-1 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-green-600" /> Fact Layer Integrity
                      </p>
                      <p className="text-xs text-neutral-600">
                        Atom atom-101 intact. Locked tokens preserved exactly.
                      </p>
                    </div>
                    {/* Deliberate seeded unsupported claim for the next stage (M4 Guardian) */}
                    <div className="bg-red-50 rounded p-3 border border-red-100 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-0.5">AI Uncertainty Note</p>
                        <p className="text-xs text-red-600">
                          Added colloquial phrase "ఫలితాలు గ్యారెంటీ!" (results guaranteed). This may trigger a compliance finding during the Brand Guardian pass.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <Button variant="outline" size="sm" fullWidth>Edit text</Button>
                    <Link href="/campaigns/123/guardian" className="w-full">
                      <Button variant="primary" size="sm" fullWidth iconRight={<ChevronRight size={14}/>}>
                        Run Brand Guardian
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
