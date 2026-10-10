"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import Link from "next/link";

export default function BriefBuilderPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-ivory pb-20">
      {/* Header */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Create Campaign Brief</h1>
            <p className="text-xs text-neutral-500">Step {step} of 3</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Save Draft</Button>
          {step < 3 ? (
            <Button variant="primary" size="sm" onClick={() => setStep(step + 1)} iconRight={<ArrowRight size={14}/>}>
              Next Step
            </Button>
          ) : (
            <Link href="/campaigns/123/studio">
              <Button variant="primary" size="sm" iconRight={<Check size={14}/>}>
                Create & Generate
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-10 px-6">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">Campaign Details</h2>
              <p className="text-sm text-neutral-500 mb-6">Define the core objective and placement.</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-graphite mb-1.5">Campaign Name</label>
                  <input type="text" placeholder="e.g., South India Diwali Push" className="w-full h-11 px-4 rounded-lg border border-forest/15 bg-white text-sm focus:ring-2 focus:ring-forest/30 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Region</label>
                    <select className="w-full h-11 px-4 rounded-lg border border-forest/15 bg-white text-sm focus:ring-2 focus:ring-forest/30 outline-none">
                      <option>Andhra Pradesh / Telangana</option>
                      <option>Tamil Nadu</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Primary Language</label>
                    <select className="w-full h-11 px-4 rounded-lg border border-forest/15 bg-white text-sm focus:ring-2 focus:ring-forest/30 outline-none">
                      <option>Telugu</option>
                      <option>Tamil</option>
                      <option>Marathi</option>
                      <option>Kannada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-graphite mb-1.5">Objective & Audience</label>
                  <textarea rows={4} placeholder="Describe the goal and target audience..." className="w-full p-4 rounded-lg border border-forest/15 bg-white text-sm focus:ring-2 focus:ring-forest/30 outline-none resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">Claim Atoms & Facts</h2>
              <p className="text-sm text-neutral-500 mb-6">Select pre-approved facts to lock into the generated content.</p>
              
              <div className="bg-white rounded-xl border border-forest/10 shadow-sm p-1">
                <div className="p-3 border-b border-forest/10 flex items-center gap-2">
                  <Search size={16} className="text-neutral-400" />
                  <input type="text" placeholder="Search Brand Library for claims..." className="w-full text-sm outline-none" />
                </div>
                <div className="p-2 space-y-2 max-h-80 overflow-auto">
                  {[
                    "Rasa Oats provides 100% of your daily iron needs when consumed with milk.",
                    "Our packaging uses 50% recycled materials.",
                    "No added sugar, naturally sweetened with real fruit extracts."
                  ].map((claim, i) => (
                    <label key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-forest/5 cursor-pointer transition">
                      <input type="checkbox" className="mt-1 rounded text-forest focus:ring-forest" />
                      <div>
                        <p className="text-sm text-graphite">{claim}</p>
                        <p className="text-2xs text-neutral-400 mt-1">Source: Nutritional Panel 2025 v2</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-graphite mb-1.5">Prohibited Phrases (Optional)</label>
                <input type="text" placeholder="e.g., 'weight loss cure', 'guaranteed'" className="w-full h-11 px-4 rounded-lg border border-forest/15 bg-white text-sm focus:ring-2 focus:ring-forest/30 outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">Review & Finalize</h2>
              <p className="text-sm text-neutral-500 mb-6">Review your brief before creating the immutable version.</p>
              
              <div className="bg-white rounded-xl border border-forest/10 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <span className="block text-xs text-neutral-400 mb-1">Campaign Name</span>
                    <span className="text-sm text-graphite font-medium">South India Diwali Push</span>
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-400 mb-1">Target Language</span>
                    <span className="text-sm text-graphite font-medium">Telugu</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-neutral-400 mb-1">Objective</span>
                    <span className="text-sm text-graphite">Drive awareness for the new family pack during the festival season.</span>
                  </div>
                </div>

                <div className="border-t border-forest/10 pt-4">
                  <span className="block text-xs text-neutral-400 mb-2">Licensed Claim Atoms (Locked)</span>
                  <div className="p-3 bg-forest/5 rounded-lg border border-forest/10 text-sm text-forest-700">
                    "Rasa Oats provides 100% of your daily iron needs when consumed with milk."
                  </div>
                </div>

                <div className="bg-sage/20 p-4 rounded-lg border border-sage-300/30 flex items-start gap-3">
                  <Check size={18} className="text-forest mt-0.5" />
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    By clicking Create, this brief will be securely hashed and locked as <strong>Version 1</strong>. Any future edits will create a new version for full audit traceability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
