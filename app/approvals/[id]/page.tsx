"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Check, CheckCircle2, XCircle, AlertCircle, FileText, User, Hash, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ReviewCenterPage() {
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/campaigns/123/guardian" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Review Center</h1>
            <p className="text-xs text-neutral-500">Asset: asset-v-003 (Draft v2)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" disabled={isApproved}>Request Revision</Button>
          {!isApproved ? (
            <Button variant="primary" size="sm" onClick={() => setIsApproved(true)} iconRight={<Check size={14}/>}>
              Approve Version
            </Button>
          ) : (
            <Link href="/campaigns/123/passport">
              <Button variant="primary" size="sm" iconRight={<ChevronRight size={14}/>}>
                View Decision Passport
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Asset & Delta */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Banner */}
          {isApproved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-green-800">Version Approved</h3>
                <p className="text-xs text-green-700 mt-1">This exact hash-verified version has been approved. It is now locked and ready for Creator Briefing or Analytics.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
            <div className="bg-sage/10 p-4 border-b border-forest/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-graphite flex items-center gap-2">
                <FileText size={16} className="text-forest" /> Current Version (v2)
              </h2>
              <Badge variant="demo" className="font-mono text-2xs">SHA: a8f9c2...41d</Badge>
            </div>
            <div className="p-6">
              <p className="text-lg text-graphite leading-relaxed" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ <span className="bg-brass/20 text-brass-700 font-medium px-1 rounded">100% రోజువారీ ఐరన్ అవసరాలను</span> ఖచ్చితంగా తీరుస్తుంది.
              </p>
            </div>
          </div>

          {/* Delta Review */}
          <div className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
            <div className="bg-neutral-50 p-4 border-b border-forest/5">
              <h2 className="text-sm font-semibold text-graphite">Delta Review (v1 to v2)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Showing exact changes from the previous draft.</p>
            </div>
            <div className="p-6">
              <p className="text-lg leading-relaxed" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                <span className="text-neutral-400">ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ 100% రోజువారీ ఐరన్ అవసరాలను ఖచ్చితంగా తీరుస్తుంది. </span>
                <span className="bg-red-100 text-red-800 line-through px-1 rounded">ఫలితాలు గ్యారెంటీ!</span>
              </p>
              <div className="mt-4 pt-4 border-t border-forest/5">
                <span className="text-xs font-semibold text-forest uppercase tracking-widest">Reviewer Note</span>
                <p className="text-sm text-neutral-600 italic mt-1">"Removed the guaranteed results claim as requested by the Guardian."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Server Gates & Audit */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-graphite mb-4 flex items-center gap-2">
              <Lock size={16} className="text-forest" /> Approval Gates
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-graphite">Hash match verified</p>
                  <p className="text-2xs text-neutral-500">You are viewing the exact current version.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-graphite">Zero Critical/High findings</p>
                  <p className="text-2xs text-neutral-500">Guardian checks passed on this version.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-graphite">Separation of Duties</p>
                  <p className="text-2xs text-neutral-500">Author (Demo) ≠ Approver (Admin).</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-brass shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-graphite">Language Competency Override</p>
                  <p className="text-2xs text-neutral-500">You lack the 'Telugu' tag. Approval requires an override note.</p>
                </div>
              </li>
            </ul>

            {!isApproved && (
              <div className="mt-5 pt-4 border-t border-forest/5">
                <label className="block text-xs font-medium text-graphite mb-1.5">Override Reason (Required)</label>
                <textarea 
                  rows={2} 
                  defaultValue="Discussed with regional team lead. Approved via Slack." 
                  className="w-full text-xs p-2 rounded-md border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
            )}
          </div>

          {/* Audit Chain preview */}
          {isApproved && (
            <div className="bg-sage/10 rounded-xl border border-sage-300 p-5 shadow-sm animate-fade-in">
              <h3 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2">
                <Hash size={16} /> Audit Chain Updated
              </h3>
              <p className="text-xs text-neutral-600 mb-2">
                Approval event appended to ledger. Previous hash securely linked.
              </p>
              <div className="bg-white border border-forest/10 rounded p-2 text-2xs font-mono text-neutral-500 break-all">
                prev: a8f9c21b29... <br/>
                curr: f73bd8a209...
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
