"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Check, Search, Plus, Trash2, ShieldCheck, Sparkles, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createNewCampaign } from "@/lib/campaigns/store";
import { ClaimAtom } from "@/lib/campaigns/types";
import { INDIA_STATES_DATA } from "@/components/three/indiaStatesData";

export default function BriefBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("South India Festive Push");
  const [objective, setObjective] = useState("Drive awareness and trust for healthy morning oats ritual across regional households.");
  const [audience, setAudience] = useState("Health-conscious mothers, working parents (ages 28-45) in tier-2 and tier-1 cities.");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Telugu");
  const [region, setRegion] = useState("Andhra Pradesh / Telangana");
  const [dialect, setDialect] = useState("Coastal Andhra & Telangana Colloquial");
  const [tone, setTone] = useState("Warm, Festive, Trustworthy");
  const [slangFormality, setSlangFormality] = useState("Conversational Respectful");
  const [culturalContext, setCulturalContext] = useState("Diwali festive breakfast and family morning health ritual.");
  const [channel, setChannel] = useState("Social Video & Reels");
  const [format, setFormat] = useState("Short Video Caption");

  // Claim Atoms State
  const [claimAtoms, setClaimAtoms] = useState<ClaimAtom[]>([
    {
      id: "claim-1",
      canonicalText: "Rasa Oats provides 100% of your daily iron needs when consumed with milk.",
      lockedTokens: ["100% daily iron", "with milk"],
      sourceTitle: "Clinical Trial Dossier CT-2024-09",
      sourceUrl: "https://library.braco.internal/clinical/iron-bioavailability.pdf",
      evidenceStatus: "supported",
    },
    {
      id: "claim-2",
      canonicalText: "100% whole grain oats with no added refined sugar.",
      lockedTokens: ["no added refined sugar", "100% whole grain"],
      sourceTitle: "Nutritional Analysis Lab Report NL-441",
      sourceUrl: "https://library.braco.internal/lab/sugar-free-cert.pdf",
      evidenceStatus: "supported",
    },
  ]);

  const [newClaimText, setNewClaimText] = useState("");
  const [newClaimSource, setNewClaimSource] = useState("");

  const handleAddClaim = () => {
    if (!newClaimText.trim()) return;
    const newAtom: ClaimAtom = {
      id: `claim-${Date.now()}`,
      canonicalText: newClaimText.trim(),
      lockedTokens: [newClaimText.slice(0, 15)],
      sourceTitle: newClaimSource.trim() || "Brand Knowledge Vault",
      evidenceStatus: "supported",
    };
    setClaimAtoms([...claimAtoms, newAtom]);
    setNewClaimText("");
    setNewClaimSource("");
  };

  const handleRemoveClaim = (id: string) => {
    setClaimAtoms(claimAtoms.filter((c) => c.id !== id));
  };

  const handleCreateCampaign = async () => {
    setLoading(true);
    try {
      const campaign = await createNewCampaign({
        name,
        objective,
        audience,
        sourceLanguage,
        targetLanguage,
        region,
        dialect,
        tone,
        slangFormality,
        culturalContext,
        channel,
        format,
        claimAtoms,
      });
      router.push(`/campaigns/${campaign.id}/studio`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory pb-20">
      {/* Header */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-semibold text-forest">Create Campaign Brief</h1>
            <p className="text-xs text-neutral-500">Step {step} of 3 • Flowchart Stage A (Setup)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          {step < 3 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(step + 1)}
              iconRight={<ArrowRight size={14} />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleCreateCampaign}
              iconRight={<Check size={14} />}
            >
              Create & Generate Variants
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-10 px-6">
        {/* Step 1: Campaign Details & Tone / Slang */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-2xs font-bold text-brass uppercase tracking-wider mb-1">
                <span>Step 1 • Master Flowchart</span>
              </div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">
                Campaign Brief & Tone Profile
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Define the campaign objective, target audience persona, and cultural register.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1.5">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., South India Festive Push"
                    className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1.5">
                    Target Audience Persona
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Describe demographics and mindset..."
                    className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Tone & Style
                    </label>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="e.g., Warm, Trustworthy, Vibrant"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Slang & Formality
                    </label>
                    <input
                      type="text"
                      value={slangFormality}
                      onChange={(e) => setSlangFormality(e.target.value)}
                      placeholder="e.g., Conversational Respectful"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1.5">
                    Cultural Context / Festive Moment
                  </label>
                  <input
                    type="text"
                    value={culturalContext}
                    onChange={(e) => setCulturalContext(e.target.value)}
                    placeholder="e.g., Deepavali morning ritual and family gathering"
                    className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1.5">
                    Campaign Objective & Core Message
                  </label>
                  <textarea
                    rows={3}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Describe the campaign core proposition..."
                    className="w-full p-3.5 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Language & Regional Selection */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-2xs font-bold text-brass uppercase tracking-wider mb-1">
                <span>Step 2 • Regional Engine</span>
              </div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">
                Select Source, Target Language & Region
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Choose the source message language and regional target dialect from India&apos;s 28 states.
              </p>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Source Language
                    </label>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                      <option>Tamil</option>
                      <option>Marathi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Target Mother Tongue
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => {
                        setTargetLanguage(e.target.value);
                        const matched = INDIA_STATES_DATA.find(
                          (s) => s.motherTongue.name.toLowerCase() === e.target.value.toLowerCase()
                        );
                        if (matched) {
                          setRegion(matched.name);
                        }
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                      <option value="Malayalam">Malayalam (മലയാളം)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                      <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                      <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                      <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Assamese">Assamese (অসমীয়া)</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Target Region / State
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g., Andhra Pradesh / Telangana"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Optional Regional Dialect
                    </label>
                    <input
                      type="text"
                      value={dialect}
                      onChange={(e) => setDialect(e.target.value)}
                      placeholder="e.g., Coastal Andhra or Telangana Hyderabadi"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Marketing Channel
                    </label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option>Social Video & Reels</option>
                      <option>Meta & Instagram Ads</option>
                      <option>YouTube Bumper Ad</option>
                      <option>WhatsApp Regional Broadcast</option>
                      <option>Print & Packaging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Asset Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option>Short Video Caption</option>
                      <option>Story Script (15s)</option>
                      <option>Hero Ad Copy</option>
                      <option>Creator Brief Prompt</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Approved Claim Atoms & Evidence */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-2xs font-bold text-brass uppercase tracking-wider mb-1">
                <span>Step 3 • Brand Guardian Pre-Check</span>
              </div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">
                Approved Claim Atoms + Evidence
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Lock pre-approved facts into the AI prompt. The Brand Guardian will strictly enforce these tokens during generation.
              </p>

              {/* Existing Claim Atoms */}
              <div className="space-y-3 mb-6">
                {claimAtoms.map((claim, idx) => (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl bg-forest/5 border border-forest/10 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-forest leading-relaxed">
                          &ldquo;{claim.canonicalText}&rdquo;
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-2xs text-graphite/60">
                          <span className="font-semibold text-brass">Source: {claim.sourceTitle}</span>
                          <span>•</span>
                          <span>Locked tokens: {claim.lockedTokens.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveClaim(claim.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Claim Atom */}
              <div className="p-4 rounded-xl border border-dashed border-forest/20 bg-ivory/50 space-y-3">
                <span className="text-xs font-semibold text-forest block">
                  Add Additional Approved Claim Atom:
                </span>
                <input
                  type="text"
                  placeholder="Enter canonical factual claim (e.g., Clinically proven 48-hour hydration)..."
                  value={newClaimText}
                  onChange={(e) => setNewClaimText(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-forest/15 bg-white text-xs outline-none focus:ring-1 focus:ring-brass"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Evidence Dossier / Lab Certificate Title..."
                    value={newClaimSource}
                    onChange={(e) => setNewClaimSource(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-forest/15 bg-white text-xs outline-none focus:ring-1 focus:ring-brass"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddClaim}
                    icon={<Plus size={14} />}
                  >
                    Add Atom
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
