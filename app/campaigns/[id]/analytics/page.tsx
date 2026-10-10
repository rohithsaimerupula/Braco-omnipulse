"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Info, Lightbulb, ExternalLink } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: 'Variant A', ctr: 1.8, impressions: 3200, clicks: 57, fill: '#DCE5D9' },
  { name: 'Variant B', ctr: 2.6, impressions: 3450, clicks: 90, fill: '#183B2B' },
];

export default function AnalyticsPage() {
  const [importStatus, setImportStatus] = useState<"idle" | "validating" | "error" | "success">("idle");
  const [useFlawed, setUseFlawed] = useState(false);

  const handleImport = () => {
    setImportStatus("validating");
    setTimeout(() => {
      setImportStatus(useFlawed ? "error" : "success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/campaigns/123/experiment" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Honest Analytics & Inference</h1>
            <p className="text-xs text-neutral-500">South India Diwali Push</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        
        {/* Step 1: Import */}
        {importStatus !== "success" && (
          <div className="bg-white rounded-xl border border-forest/10 p-8 shadow-sm mb-8 animate-fade-in text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="text-forest" size={28} />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-forest mb-2">Import Campaign Data</h2>
            <p className="text-sm text-neutral-500 mb-8">
              Since the experiment is locked, you can now upload the final CSV from your ad platform to measure the primary metric.
            </p>

            <div className="bg-sage/10 rounded-xl p-6 border border-sage-300/30 flex flex-col items-center justify-center border-dashed mb-6">
              <Upload size={24} className="text-forest-400 mb-3" />
              <p className="text-sm font-medium text-graphite mb-1">Drag and drop your CSV here</p>
              <p className="text-xs text-neutral-400">or click to browse</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="sm" onClick={() => { setUseFlawed(false); handleImport(); }} disabled={importStatus === "validating"}>
                Import Valid Synthetic CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setUseFlawed(true); handleImport(); }} disabled={importStatus === "validating"} className="text-brass-700 border-brass/40 bg-brass/5 hover:bg-brass/10 hover:border-brass/50">
                Test with Flawed CSV
              </Button>
            </div>

            {importStatus === "validating" && (
              <p className="text-xs font-medium text-forest mt-6 animate-pulse">Running deterministic validation...</p>
            )}

            {importStatus === "error" && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-left animate-fade-in">
                <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} /> Validation Failed (3 errors)
                </h4>
                <ul className="text-xs text-red-700 space-y-2 list-disc pl-5">
                  <li>Row 4: `clicks` (120) cannot be greater than `impressions` (85).</li>
                  <li>Row 9: `spend` has mixed currencies (USD instead of INR).</li>
                  <li>Row 12: Missing `attribution_window` value.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-red-100 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setImportStatus("idle")}>Cancel Import</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Dashboard */}
        {importStatus === "success" && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-forest">Experiment Results</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="demo">Synthetic Data Source</Badge>
                  <span className="text-xs text-neutral-500">Imported Oct 10, 2026</span>
                </div>
              </div>
              <Badge variant="success" className="px-3 py-1.5 text-xs">Analysis Complete</Badge>
            </div>

            {/* Inference & Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-graphite mb-1">Primary Metric: Click-Through Rate</h3>
                <p className="text-xs text-neutral-400 mb-6">Variant B vs Control</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `${val}%`} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                      <Bar dataKey="ctr" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inference Gate Result */}
              <div className="bg-sage/10 rounded-xl border border-sage-300/50 p-6 shadow-sm flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-forest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" /> Data Sufficiency Met
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Variant A Events</span>
                    <p className="text-sm font-mono text-graphite">57 clicks {">"} 30 threshold</p>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Variant B Events</span>
                    <p className="text-sm font-mono text-graphite">90 clicks {">"} 30 threshold</p>
                  </div>
                </div>

                <div className="bg-white border border-forest/10 p-4 rounded-lg text-sm text-graphite leading-relaxed">
                  <p>
                    Variant B demonstrates a <strong>statistically significant increase</strong> in CTR. 
                    <br/><br/>
                    <span className="text-xs text-neutral-500">Wilson 95% CI separation observed. Two-proportion z-test confirms association.</span>
                  </p>
                </div>
              </div>

              {/* Data Provenance Details */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-forest/5 bg-neutral-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-graphite flex items-center gap-2">
                    <Info size={16} className="text-forest" /> Data Provenance & Safety
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Data Source</span>
                    <Badge variant="demo" className="text-2xs py-0">Synthetic/Demo</Badge>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Calculation Method</span>
                    <p className="text-sm text-graphite">Deterministic (TypeScript)</p>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Missing Values</span>
                    <p className="text-sm text-graphite">0 null denominators found</p>
                  </div>
                  <div>
                    <span className="block text-2xs uppercase tracking-widest text-neutral-500 mb-1">Causality Claim</span>
                    <p className="text-sm text-graphite text-brass-700">None (Association only)</p>
                  </div>
                </div>
              </div>

              {/* Learning Loop Inbox */}
              <div className="lg:col-span-3 bg-brass/5 rounded-xl border border-brass/20 p-6 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-brass/30 shadow-sm">
                  <Lightbulb size={20} className="text-brass-700" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-graphite mb-1">Proposed Learning for Brand Knowledge Library</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Based on the confirmed data sufficiency, the system proposes adding the following insight to the active ruleset for future Telugu campaigns.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-forest/10 mb-4 text-sm text-graphite italic border-l-4 border-l-brass">
                    "When targeting urban youth in Telangana/Andhra, using modern colloquial styling ('బిజీ లైఫ్') yields higher engagement than traditional formal festival greetings."
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">Approve & Add to Library</Button>
                    <Button variant="outline" size="sm">Dismiss</Button>
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
