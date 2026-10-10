"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, Hash, ShieldCheck, Printer, CheckCircle2, User, FileText, Share2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function DecisionPassportPage() {
  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/approvals/123" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Decision Passport</h1>
            <p className="text-xs text-neutral-500">Immutable record of approval</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Share2 size={14}/>}>Share Link</Button>
          <Button variant="primary" size="sm" onClick={() => window.print()} iconRight={<Printer size={14}/>}>
            Print / Save PDF
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-6 print:mt-0 print:px-0">
        
        {/* Printable Passport Paper */}
        <div className="bg-white border border-forest/10 shadow-editorial p-10 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-forest/20">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest mb-2">Decision Passport</h2>
              <p className="text-sm text-graphite uppercase tracking-widest">Braco OmniPulse • Asset Verification</p>
            </div>
            <div className="text-right">
              <Badge variant="success" className="mb-2 uppercase tracking-widest text-xs px-3 py-1">APPROVED</Badge>
              <p className="text-2xs font-mono text-neutral-400">ID: asset-v-003</p>
              <p className="text-2xs font-mono text-neutral-400">Date: Oct 10, 2026 16:35 IST</p>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
            <div>
              <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-1.5">Asset Content (Telugu)</span>
              <p className="text-sm text-graphite leading-relaxed border-l-2 border-forest/20 pl-4 py-1" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ 100% రోజువారీ ఐరన్ అవసరాలను ఖచ్చితంగా తీరుస్తుంది.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-1.5">Campaign Context</span>
                <p className="text-sm text-graphite"><strong>Name:</strong> South India Diwali Push</p>
                <p className="text-sm text-graphite"><strong>Format:</strong> Short Video Caption</p>
                <p className="text-sm text-graphite"><strong>Brief Version:</strong> v1 (SHA: e9b2a1...9c)</p>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-1.5">Claim Atoms Utilized</span>
              <div className="text-sm text-graphite bg-forest/5 p-3 rounded">
                <p className="font-medium mb-1">atom-101 (Verified)</p>
                <p className="text-xs text-neutral-600">"Rasa Oats provides 100% of your daily iron needs when consumed with milk."</p>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-1.5">Approval Information</span>
              <div className="text-sm text-graphite space-y-1">
                <p className="flex items-center gap-2"><User size={14} className="text-neutral-400"/> Admin (demo@bracoomnipulse.com)</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600"/> Gates Passed: 4/4</p>
                <p className="flex items-center gap-2"><AlertCircle size={14} className="text-brass"/> Language Override Applied</p>
                <p className="text-xs text-neutral-500 italic border-l-2 border-brass/50 pl-2 mt-1">"Discussed with regional team lead. Approved via Slack."</p>
              </div>
            </div>
          </div>

          {/* Tamper-Evident Hash Chain */}
          <div className="mt-12 pt-6 border-t border-forest/10">
            <span className="block text-xs font-semibold text-forest uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> Tamper-Evident Decision Trace
            </span>
            
            <div className="relative border-l border-forest/20 ml-3 pl-6 space-y-6">
              {[
                { event: "Brief Locked", time: "16:15 IST", hash: "sha256:e9b2a1f4...", actor: "Admin" },
                { event: "Generation (v1)", time: "16:20 IST", hash: "sha256:7c9f8a3d...", actor: "AI Demo Adapter" },
                { event: "Guardian Checked", time: "16:21 IST", hash: "sha256:b4f2c9e1...", actor: "System" },
                { event: "Draft Revised (v2)", time: "16:30 IST", hash: "sha256:a8f9c21b...", actor: "Admin" },
                { event: "Approval Granted", time: "16:35 IST", hash: "sha256:f73bd8a2...", actor: "Admin" },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 bg-white border-2 border-forest rounded-full"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-graphite">{step.event}</p>
                      <p className="text-xs text-neutral-500">{step.actor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-graphite">{step.time}</p>
                      <p className="text-2xs font-mono text-neutral-400 flex items-center gap-1 justify-end mt-0.5">
                        <Hash size={10}/> {step.hash}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center print:mt-24">
            <p className="text-2xs text-neutral-400 font-mono">End of Passport. Hash chain verified against database ledger.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Ensure AlertCircle is imported properly by fixing imports at the top
import { AlertCircle } from "lucide-react";
