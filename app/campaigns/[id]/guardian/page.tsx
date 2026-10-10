"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, XCircle, Search, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function BrandGuardianPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [resolvedFindings, setResolvedFindings] = useState<Record<string, string>>({});

  const handleRunGuardian = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 2000); // Simulate 3-pass verification
  };

  const markResolved = (id: string, resolution: string) => {
    setResolvedFindings(prev => ({ ...prev, [id]: resolution }));
  };

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/campaigns/123/studio" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Brand Guardian & Claim Ledger</h1>
            <p className="text-xs text-neutral-500">Variant B: Modern Lifestyle (Telugu)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRunGuardian} disabled={isRunning || hasRun}>
            {isRunning ? "Running 3-Pass Checks..." : hasRun ? "Checks Complete" : "Run Brand Guardian"}
          </Button>
          {hasRun && (
            <Link href="/approvals/asset-v-002">
              <Button variant="primary" size="sm">Send to Review Center</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        
        {/* The Asset under review */}
        <div className="bg-white rounded-xl border border-forest/10 p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-graphite flex items-center gap-2">
              <FileText size={16} className="text-forest" />
              Asset text under review
            </h3>
            <span className="text-2xs text-neutral-400 font-mono">asset-v-002</span>
          </div>
          <p className="text-lg text-graphite leading-relaxed" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
            ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ <span className="bg-brass/20 text-brass-700 font-medium px-1 rounded">100% రోజువారీ ఐరన్ అవసరాలను</span> ఖచ్చితంగా తీరుస్తుంది. <span className={hasRun && !resolvedFindings['f-1'] ? "bg-red-100 text-red-800 font-medium px-1 rounded" : ""}>ఫలితాలు గ్యారెంటీ!</span>
          </p>
        </div>

        {!hasRun && !isRunning && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-forest/5 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-forest" size={28} />
            </div>
            <h2 className="font-serif text-xl text-forest mb-2">Ready for verification</h2>
            <p className="text-sm text-neutral-500 max-w-md">
              The Guardian will run 3 passes: deterministic rule matching, back-translation drift check, and contextual AI risk review.
            </p>
          </div>
        )}

        {isRunning && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-xl border border-forest/20 flex flex-col items-center justify-center shadow-sm animate-pulse">
                <span className="text-xs font-bold text-forest">1</span>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl border border-forest/20 flex flex-col items-center justify-center shadow-sm animate-pulse" style={{ animationDelay: "200ms" }}>
                <span className="text-xs font-bold text-forest">2</span>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl border border-forest/20 flex flex-col items-center justify-center shadow-sm animate-pulse" style={{ animationDelay: "400ms" }}>
                <span className="text-xs font-bold text-forest">3</span>
              </div>
            </div>
            <p className="text-sm font-medium text-graphite">Analyzing semantic drift and compliance rules...</p>
          </div>
        )}

        {hasRun && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl text-forest font-semibold">Claim Ledger</h2>
              <Badge variant="demo">1 Finding requires action</Badge>
            </div>

            <div className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
              
              {/* Finding 1 (Critical - Seeded) */}
              <div className={`p-6 border-l-4 ${resolvedFindings['f-1'] ? 'border-l-green-500 opacity-60' : 'border-l-red-500 bg-red-50/30'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className={resolvedFindings['f-1'] ? 'text-green-500' : 'text-red-500'} />
                    <div>
                      <h4 className="text-sm font-semibold text-graphite flex items-center gap-2">
                        Prohibited Claim Detected
                        {!resolvedFindings['f-1'] && <span className="text-2xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Critical</span>}
                        {resolvedFindings['f-1'] && <span className="text-2xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Resolved</span>}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Pass 1 (Deterministic) & Pass 3 (Contextual AI)</p>
                    </div>
                  </div>
                  {!resolvedFindings['f-1'] && (
                    <div className="text-xs text-neutral-400">ID: f-1</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Exact Text Span</span>
                    <div className="p-2 bg-white rounded border border-red-100 text-sm text-graphite" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                      "ఫలితాలు గ్యారెంటీ!" (Results guaranteed!)
                    </div>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Explanation</span>
                    <p className="text-sm text-graphite">
                      Violates Brand Rule: <strong>"No health guarantees"</strong>. The phrase "గ్యారెంటీ" (guarantee) is strictly prohibited in health and food marketing without clinical evidence.
                    </p>
                  </div>
                </div>

                {!resolvedFindings['f-1'] ? (
                  <div className="bg-white rounded-lg border border-forest/10 p-4">
                    <span className="block text-xs font-medium text-graphite mb-3">Resolution Actions</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => markResolved('f-1', 'deleted')} icon={<XCircle size={14}/>}>
                        Delete claim from asset
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => markResolved('f-1', 'dismissed')} className="text-neutral-500">
                        Dismiss (Requires Override Note)
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100 w-fit">
                    <CheckCircle2 size={14} />
                    Resolution: {resolvedFindings['f-1'] === 'deleted' ? 'Claim removed from drafting asset.' : 'Dismissed with override.'}
                  </div>
                )}
              </div>

              {/* Finding 2 (Supported Fact) */}
              <div className="p-6 border-t border-forest/10 border-l-4 border-l-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <div>
                      <h4 className="text-sm font-semibold text-graphite flex items-center gap-2">
                        Supported Factual Claim
                        <span className="text-2xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Verified</span>
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Pass 1 (Locked Token Check)</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Exact Text Span</span>
                    <div className="p-2 bg-white rounded border border-forest/10 text-sm text-graphite" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                      "100% రోజువారీ ఐరన్ అవసరాలను" (100% daily iron needs)
                    </div>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Evidence Status</span>
                    <p className="text-sm text-graphite mb-1">Supported by <strong>atom-101</strong>.</p>
                    <Link href="/dashboard/library" className="text-xs text-forest flex items-center gap-1 hover:underline">
                      <ExternalLink size={12} /> View Source: Nutritional Panel 2025 v2
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {resolvedFindings['f-1'] && (
              <div className="bg-sage/20 border border-sage-300 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-forest mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-forest">All Critical Findings Resolved</h4>
                  <p className="text-xs text-neutral-600 mt-1">This asset version is now eligible for gated approval in the Review Center. Note: Modifying the text will void this state and create a new version.</p>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
