"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createNewCampaign } from "@/lib/campaigns/store";
import { ClaimAtom } from "@/lib/campaigns/types";

export default function BriefBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Section 1: Separate Regional Configuration Fields
  const [name, setName] = useState("GreenGlow Aloe Vera Gel — Everyday Hydration");
  const [brandName, setBrandName] = useState("GreenGlow");
  const [objective, setObjective] = useState(
    "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use."
  );
  const [audience, setAudience] = useState(
    "Skincare-conscious adults looking for lightweight daily moisture."
  );
  const [audienceAgeGroup, setAudienceAgeGroup] = useState("22-38");
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Telugu");
  const [region, setRegion] = useState("Andhra Pradesh");
  // Rule 1 & 3: Do NOT infer a specific dialect from language alone; optional field
  const [dialect, setDialect] = useState("");
  const [tone, setTone] = useState("Clear, Calm, Informative");
  const [formality, setFormality] = useState("Conversational Respectful");
  const [slangIntensity, setSlangIntensity] = useState("none");
  // Rule 3: Use only the cultural context supplied in the brief. If not specified, do not add a festival.
  const [culturalContext, setCulturalContext] = useState("");
  const [channel, setChannel] = useState("Meta & Instagram Ads");
  const [format, setFormat] = useState("Short Video Caption");

  // Claim Atoms State
  const [claimAtoms, setClaimAtoms] = useState<ClaimAtom[]>([
    {
      id: "claim-gg-1",
      canonicalText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      lockedTokens: ["GreenGlow", "with regular use", "hydrated"],
      requiredQualifications: ["with regular use"],
      sourceTitle: "Dermatological Evaluation Dossier GG-2026-01",
      evidenceStatus: "supported",
    },
    {
      id: "claim-gg-2",
      canonicalText: "Made with 95% pure aloe vera leaf extract.",
      lockedTokens: ["95%", "pure aloe vera leaf extract"],
      sourceTitle: "Formulation Lab Certificate GG-LAB-09",
      evidenceStatus: "supported",
    },
  ]);

  const [newClaimText, setNewClaimText] = useState("");
  const [newClaimSource, setNewClaimSource] = useState("");

  const loadGreenGlowPreset = () => {
    setName("GreenGlow Aloe Vera Gel — Everyday Hydration");
    setBrandName("GreenGlow");
    setObjective(
      "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use."
    );
    setAudience(
      "Skincare-conscious adults looking for lightweight daily moisture."
    );
    setAudienceAgeGroup("22-38");
    setSourceLanguage("English");
    setTargetLanguage("Telugu");
    setRegion("Andhra Pradesh");
    setDialect("Coastal Andhra");
    setTone("Clear, Calm, Informative");
    setFormality("Conversational Respectful");
    setSlangIntensity("none");
    setCulturalContext("");
    setChannel("Meta & Instagram Ads");
    setFormat("Short Video Caption");
    setClaimAtoms([
      {
        id: "claim-gg-1",
        canonicalText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        lockedTokens: ["GreenGlow", "with regular use", "hydrated"],
        requiredQualifications: ["with regular use"],
        sourceTitle: "Dermatological Evaluation Dossier GG-2026-01",
        evidenceStatus: "supported",
      },
      {
        id: "claim-gg-2",
        canonicalText: "Made with 95% pure aloe vera leaf extract.",
        lockedTokens: ["95%", "pure aloe vera leaf extract"],
        sourceTitle: "Formulation Lab Certificate GG-LAB-09",
        evidenceStatus: "supported",
      },
    ]);
  };

  const loadFestiveOatsPreset = () => {
    setName("South India Diwali Push");
    setBrandName("Rasa Oats");
    setObjective(
      "Rasa Oats provides 100% of your daily iron needs when consumed with warm milk."
    );
    setAudience("Health-conscious urban and tier-2 families, working parents.");
    setAudienceAgeGroup("28-45");
    setSourceLanguage("English");
    setTargetLanguage("Telugu");
    setRegion("Telangana");
    setDialect("Telangana");
    setTone("Warm, Festive, Trustworthy");
    setFormality("Conversational Respectful");
    setSlangIntensity("light");
    setCulturalContext("Diwali healthy family breakfast ritual.");
    setChannel("Social Video & Reels");
    setFormat("Short Video Caption");
    setClaimAtoms([
      {
        id: "claim-1",
        canonicalText:
          "Rasa Oats provides 100% of your daily iron needs when consumed with milk.",
        lockedTokens: ["100% daily iron", "with milk"],
        requiredQualifications: ["when consumed with milk"],
        sourceTitle: "Clinical Trial Dossier CT-2024-09",
        evidenceStatus: "supported",
      },
      {
        id: "claim-2",
        canonicalText: "100% whole grain oats with no added refined sugar.",
        lockedTokens: ["no added refined sugar", "100% whole grain"],
        sourceTitle: "Nutritional Analysis Lab Report NL-441",
        evidenceStatus: "supported",
      },
    ]);
  };

  const handleAddClaim = () => {
    if (!newClaimText.trim()) return;
    const newAtom: ClaimAtom = {
      id: `claim-${Date.now()}`,
      canonicalText: newClaimText.trim(),
      lockedTokens: [newClaimText.slice(0, 18).trim()],
      sourceTitle: newClaimSource.trim() || "Brand Knowledge Library",
      evidenceStatus: newClaimSource.trim() ? "supported" : "evidence_missing",
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
        brandName,
        objective,
        audience,
        audienceAgeGroup,
        sourceLanguage,
        targetLanguage,
        region,
        dialect: dialect.trim() || undefined,
        tone,
        formality,
        slangIntensity,
        slangFormality: `${formality} (Slang: ${slangIntensity})`,
        culturalContext: culturalContext.trim(),
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
            <h1 className="font-serif text-lg font-semibold text-forest">
              Create Campaign Brief (Regional Configuration)
            </h1>
            <p className="text-xs text-neutral-500">
              Step {step} of 3 • Separate Dialect, Formality, Slang &amp; Cultural Controls
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
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
              Lock Brief &amp; Generate Adaptation
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-6">
        {/* Quick Benchmark Presets */}
        <div className="bg-sage/15 border border-sage-300/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-forest">
            <Sparkles size={15} className="text-brass shrink-0" />
            <span>
              <strong>Test Case Presets:</strong> Load canonical briefs to verify Regional Quality Rules
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={loadGreenGlowPreset}
            >
              GreenGlow Test Case (No Festival/Guarantee)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={loadFestiveOatsPreset}
            >
              Diwali Oats Case (Explicit Festival)
            </Button>
          </div>
        </div>

        {/* Step 1: Campaign Details, Audience Age Group, Tone, Formality, Slang & Cultural Context */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-2xs font-bold text-brass uppercase tracking-wider mb-1">
                <span>Step 1 • Campaign &amp; Cultural Controls</span>
              </div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">
                Campaign Brief, Register &amp; Cultural Context
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Cultural context is strictly opt-in: if left blank, the Regional Engine will never invent a festival or family-health claim.
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Brand Name (Locked)
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g., GreenGlow"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Target Audience Persona
                    </label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Audience Age Group (Optional)
                    </label>
                    <input
                      type="text"
                      value={audienceAgeGroup}
                      onChange={(e) => setAudienceAgeGroup(e.target.value)}
                      placeholder="e.g., 22-38"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Tone
                    </label>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="e.g., Clear, Calm, Informative"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Formality
                    </label>
                    <select
                      value={formality}
                      onChange={(e) => setFormality(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option value="Conversational Respectful">
                        Conversational Respectful
                      </option>
                      <option value="Formal">Formal</option>
                      <option value="Respectful Civic">Respectful Civic</option>
                      <option value="Casual">Casual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Slang Intensity
                    </label>
                    <select
                      value={slangIntensity}
                      onChange={(e) => setSlangIntensity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option value="none">None (Standard Register)</option>
                      <option value="light">Light Colloquial</option>
                      <option value="moderate">Moderate Regional Slang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1">
                    Cultural Context (Optional — Only if explicitly applicable)
                  </label>
                  <input
                    type="text"
                    value={culturalContext}
                    onChange={(e) => setCulturalContext(e.target.value)}
                    placeholder="Leave blank unless a specific festival or cultural occasion is required..."
                    className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                  />
                  <p className="text-2xs text-neutral-500 mt-1 flex items-center gap-1">
                    <Info size={12} className="text-forest" />
                    Rule 3: If no festive moment is specified here, the engine will NOT add any festival reference.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1.5">
                    Campaign Objective &amp; Source Copy
                  </label>
                  <textarea
                    rows={3}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Enter the core product message..."
                    className="w-full p-3.5 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Language, State/Region, Optional Dialect, Channel & Format */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-2xs font-bold text-brass uppercase tracking-wider mb-1">
                <span>Step 2 • Regional Configuration (Section 1)</span>
              </div>
              <h2 className="text-xl font-serif text-forest font-semibold mb-1">
                Source Language, Target Language, Region &amp; Optional Dialect
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Rule 1 &amp; 3: Dialect is never inferred from the language alone. Leave dialect blank to generate neutral standard regional copy.
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
                      <option value="English">English</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => {
                        setTargetLanguage(e.target.value);
                        // Rule 1: Do NOT infer a specific dialect from language alone!
                        setDialect("");
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="English">English</option>
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
                      Target State or Region
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g., Andhra Pradesh or Telangana"
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1.5">
                      Optional Dialect (Not inferred automatically)
                    </label>
                    <select
                      value={dialect}
                      onChange={(e) => setDialect(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-forest/15 bg-ivory/50 text-sm focus:ring-2 focus:ring-forest/20 outline-none"
                    >
                      <option value="">
                        None specified (Use Neutral Regional Standard)
                      </option>
                      <option value="Coastal Andhra">
                        Coastal Andhra Telugu
                      </option>
                      <option value="Telangana">
                        Telangana Telugu
                      </option>
                      <option value="Rayalaseema">
                        Rayalaseema Telugu
                      </option>
                      <option value="Kongu Tamil">Kongu Tamil</option>
                      <option value="Pune Standard Marathi">
                        Pune Standard Marathi
                      </option>
                    </select>
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
                      <option>Meta &amp; Instagram Ads</option>
                      <option>Social Video &amp; Reels</option>
                      <option>YouTube Bumper Ad</option>
                      <option>WhatsApp Regional Broadcast</option>
                      <option>Print &amp; Packaging</option>
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
                      <option>Long-Form Copy</option>
                      <option>Story Script (15s)</option>
                      <option>Hero Ad Copy</option>
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
                Approved Claim Atoms + Qualifications
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                The Brand Guardian verifies the complete generated copy against these claims, checking for missing qualifications, exaggerations, or unrequested claims.
              </p>

              <div className="space-y-3 mb-6">
                {claimAtoms.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl bg-forest/5 border border-forest/10 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={18}
                        className="text-emerald-600 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-forest leading-relaxed">
                          &ldquo;{claim.canonicalText}&rdquo;
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-2xs text-graphite/60">
                          <span className="font-semibold text-brass">
                            Source: {claim.sourceTitle}
                          </span>
                          <span>•</span>
                          <span>
                            Locked tokens: {claim.lockedTokens.join(", ")}
                          </span>
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

              <div className="p-4 rounded-xl border border-dashed border-forest/20 bg-ivory/50 space-y-3">
                <span className="text-xs font-semibold text-forest block">
                  Add Additional Approved Claim Atom:
                </span>
                <input
                  type="text"
                  placeholder="Enter canonical factual claim (e.g., Made with 95% pure aloe vera leaf extract)..."
                  value={newClaimText}
                  onChange={(e) => setNewClaimText(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-forest/15 bg-white text-xs outline-none focus:ring-1 focus:ring-brass"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Evidence Dossier / Lab Certificate Title (leave blank to test missing evidence)..."
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
