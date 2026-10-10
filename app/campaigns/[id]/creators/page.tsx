"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Search, UserCheck, HelpCircle, FileText, CheckCircle2, ChevronRight, Download } from "lucide-react";
import Link from "next/link";

export default function CreatorMatchPage() {
  return (
    <div className="min-h-screen bg-ivory pb-20">
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/campaigns/123/passport" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Creator Match</h1>
            <p className="text-xs text-neutral-500">Asset: asset-v-003 (Approved Telugu Variant)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" iconLeft={<Download size={14}/>}>Download Creator Brief</Button>
          <Link href="/campaigns/123/experiment">
            <Button variant="primary" size="sm" iconRight={<ChevronRight size={14}/>}>Plan Experiment</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Creator Brief Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-sage/10 rounded-xl border border-sage-300 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-forest mb-4 flex items-center gap-2">
              <FileText size={16} /> Auto-Generated Creator Brief
            </h2>
            <p className="text-xs text-neutral-600 mb-4">
              Generated automatically from the approved asset version. Ensuring brand compliance before it reaches the influencer.
            </p>
            
            <div className="space-y-4">
              <div>
                <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Deliverables</span>
                <p className="text-sm text-graphite font-medium">1x Short Video (Reel/Shorts)</p>
              </div>
              <div>
                <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Approved Message (Must Use)</span>
                <p className="text-sm text-graphite border-l-2 border-forest/20 pl-2 py-0.5" style={{ fontFamily: "var(--font-telugu), sans-serif" }}>
                  ఈ బిజీ లైఫ్‌లో ఆరోగ్యం ముఖ్యమే కదా? రసా ఓట్స్ తినండి, ఫుల్ యాక్టివ్‌గా ఉండండి! ఇది పాలతో తీసుకుంటే మీ 100% రోజువారీ ఐరన్ అవసరాలను ఖచ్చితంగా తీరుస్తుంది.
                </p>
              </div>
              <div>
                <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Prohibited Claims</span>
                <ul className="text-sm text-graphite list-disc list-inside">
                  <li>Results guaranteed</li>
                  <li>Weight loss cure</li>
                </ul>
              </div>
              <div>
                <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Mandatory Disclosure</span>
                <p className="text-sm text-graphite">Must include #Ad in native script (#ప్రకటన) in first 2 lines of caption.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transparent Matching */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-forest font-semibold">Recommended Creators</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Matching based on language, region, and content category.</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search creators..." className="h-9 pl-9 pr-4 rounded-lg border border-forest/15 bg-white text-xs focus:ring-2 focus:ring-forest/30 outline-none w-64" />
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Creator 1 */}
            <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brass/20 flex items-center justify-center font-serif text-brass-700 text-lg">VK</div>
                  <div>
                    <h3 className="text-base font-semibold text-graphite">Venkatesh K.</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="demo" className="text-2xs py-0">Synthetic Profile</Badge>
                      <span className="text-xs text-neutral-500">Health & Fitness</span>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm">Shortlist</Button>
              </div>

              <div className="bg-forest/5 rounded-lg p-4 border border-forest/10">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-forest mb-3 flex items-center gap-1.5">
                  <UserCheck size={14} /> Match Rationale
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600"/> Language Fit</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">Primary language is Telugu (Match)</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600"/> Content Category</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">Focuses on morning routines and fitness (Match)</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600"/> Brand Safety</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">No flagged controversies in last 12 mo.</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><HelpCircle size={14} className="text-brass"/> Missing Data</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">Audience age demographics not verified recently.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator 2 */}
            <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm opacity-75">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center font-serif text-forest text-lg">AS</div>
                  <div>
                    <h3 className="text-base font-semibold text-graphite">Anusha S.</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="demo" className="text-2xs py-0">Synthetic Profile</Badge>
                      <span className="text-xs text-neutral-500">Food & Lifestyle</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Shortlist</Button>
              </div>

              <div className="bg-forest/5 rounded-lg p-4 border border-forest/10">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-forest mb-3 flex items-center gap-1.5">
                  <UserCheck size={14} /> Match Rationale
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600"/> Language Fit</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">Primary language is Telugu (Match)</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-graphite flex items-center gap-1.5"><HelpCircle size={14} className="text-brass"/> Content Category</p>
                    <p className="text-xs text-neutral-600 ml-5 mt-0.5">Food recipes (Partial Match for health oats)</p>
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
