"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Wand2,
  Info,
  ChevronRight,
  Languages,
  RefreshCw,
  ShieldCheck,
  GitBranch,
  Lock,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  generateDualAdaptations,
  createNewVersionFromEdit,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion } from "@/lib/campaigns/types";

export default function RegionalCreativeStudioPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "south-india-diwali";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      const ver =
        loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
        loaded.versions[loaded.versions.length - 1];
      setCurrentVersion(ver);
      setEditedText(ver.naturalAdaptation);
    }
  }, [campaignId]);

  const handleRunEngine = async () => {
    if (!campaign || !currentVersion) return;
    setIsGenerating(true);
    setTimeout(async () => {
      const updatedVer = await generateDualAdaptations(campaign.id, currentVersion.id);
      const refreshed = getCampaignById(campaign.id);
      if (refreshed) {
        setCampaign(refreshed);
        setCurrentVersion(updatedVer);
        setEditedText(updatedVer.naturalAdaptation);
      }
      setIsGenerating(false);
    }, 900);
  };

  const handleSaveManualEdit = async () => {
    if (!campaign || !currentVersion) return;
    const newVer = await createNewVersionFromEdit(
      campaign.id,
      currentVersion.id,
      editedText,
      editNote || "Manual creative refinement in Studio"
    );
    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setCurrentVersion(newVer);
    }
    setIsEditing(false);
    setEditNote("");
  };

  if (!campaign || !currentVersion) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-forest">Loading Creative Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Sticky Header with Workflow Progress */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-lg font-semibold text-forest">
                Language Adaptation Engine & Creative Studio
              </h1>
              <Badge variant="demo">
                v{currentVersion.versionNumber} • {currentVersion.state}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — {campaign.brief.sourceLanguage} → {campaign.brief.targetLanguage} ({campaign.brief.region})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunEngine}
            disabled={isGenerating}
            icon={<Wand2 size={14} />}
          >
            {isGenerating ? "Adapting..." : "Re-run Dual Generation"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/campaigns/${campaign.id}/guardian`)}
            iconRight={<ChevronRight size={14} />}
          >
            Run Brand Guardian Checks
          </Button>
        </div>
      </header>

      {/* Lifecycle Stepper Banner */}
      <div className="bg-forest text-ivory px-8 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-6 max-w-6xl mx-auto w-full">
          <span className="flex items-center gap-1.5 text-brass font-semibold">
            1. Brief Locked ✓
          </span>
          <span className="text-ivory/30">→</span>
          <span className="flex items-center gap-1.5 bg-brass/20 text-brass-200 px-2.5 py-0.5 rounded-full font-semibold border border-brass/40">
            2. Dual Language Adaptation (Active)
          </span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">3. Brand Guardian 4-Way Check</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">4. Human Approval Gate</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">5. Experiment & Passport</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-8 px-6 space-y-8">
        {/* Step 1: Source Campaign Copy & Cultural Context Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-forest uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> Source Campaign Copy ({campaign.brief.sourceLanguage})
              </h3>
              <span className="text-2xs font-mono text-neutral-400">
                Format: {campaign.brief.format}
              </span>
            </div>
            <p className="text-base text-graphite leading-relaxed bg-ivory/70 p-4 rounded-lg border border-forest/10">
              &ldquo;{currentVersion.sourceText}&rdquo;
            </p>

            {/* Locked Claim Atoms */}
            <div className="mt-4 pt-4 border-t border-forest/10">
              <h4 className="text-xs font-semibold text-forest mb-2 flex items-center gap-1.5">
                <Lock size={13} className="text-brass" /> Locked Fact Layer (Claim Atoms + Clinical Evidence)
              </h4>
              <div className="space-y-2">
                {campaign.brief.claimAtoms.map((atom) => (
                  <div
                    key={atom.id}
                    className="bg-sage/10 rounded-lg p-3 border border-sage-300/40 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-2 text-xs text-forest-800">
                      <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">&ldquo;{atom.canonicalText}&rdquo;</p>
                        <p className="text-2xs text-neutral-500 mt-0.5">
                          Source: <strong>{atom.sourceTitle}</strong> • Locked Tokens:{" "}
                          {atom.lockedTokens.map((t) => (
                            <span
                              key={t}
                              className="inline-block bg-brass/20 text-forest px-1.5 py-0.2 rounded font-mono mx-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Supported</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cultural Context Analysis Card (Flowchart 5 Node B & C) */}
          <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-forest uppercase tracking-widest mb-4 flex items-center gap-2">
                <Languages size={15} /> Cultural & Dialect Matrix
              </h3>
              <dl className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-forest/5">
                  <dt className="text-neutral-500">Target Language</dt>
                  <dd className="font-semibold text-forest">{campaign.brief.targetLanguage}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-forest/5">
                  <dt className="text-neutral-500">Target Region</dt>
                  <dd className="font-semibold text-graphite">{campaign.brief.region}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-forest/5">
                  <dt className="text-neutral-500">Regional Dialect</dt>
                  <dd className="font-medium text-graphite">{campaign.brief.dialect}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-forest/5">
                  <dt className="text-neutral-500">Tone & Slang</dt>
                  <dd className="font-medium text-graphite">{campaign.brief.slangFormality}</dd>
                </div>
                <div className="pt-1">
                  <dt className="text-neutral-500 mb-1">Cultural Hook</dt>
                  <dd className="text-graphite bg-ivory p-2.5 rounded border border-forest/10 leading-relaxed">
                    {campaign.brief.culturalContext}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Meaning Preservation Score Gauge (Flowchart 5 Node F & G) */}
            <div className="mt-6 pt-4 border-t border-forest/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-forest flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-600" />
                  Meaning Preservation Check
                </span>
                <span className="text-sm font-bold text-green-700">
                  {currentVersion.meaningPreservationScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest transition-all duration-500"
                  style={{ width: `${currentVersion.meaningPreservationScore}%` }}
                />
              </div>
              <p className="text-2xs text-neutral-500 mt-1.5">
                ✓ Core factual intent &gt;90% threshold preserved across linguistic adaptation.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Side-by-Side Comparison (Flowchart 5: Literal Translation vs Natural Regional Adaptation) */}
        {isGenerating ? (
          <div className="bg-white rounded-xl border border-forest/10 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-sage-200 border-t-forest rounded-full animate-spin mb-4" />
            <h3 className="font-serif text-lg text-forest mb-1">
              Running Dual-Track Linguistic Generation...
            </h3>
            <p className="text-xs text-neutral-500">
              Synthesizing Literal Baseline vs. Culturally Adapted {campaign.brief.targetLanguage} Copy
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-forest font-semibold">
                  Side-by-Side Comparison: Literal vs. Natural Regional Adaptation
                </h2>
                <p className="text-xs text-neutral-500">
                  Flowchart Stage D → E → F: Compare direct lexical translation against idiomatic regional adaptation.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                <GitBranch size={14} className="text-forest" />
                SHA-256: {currentVersion.contentHash.slice(0, 14)}...
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Literal Translation */}
              <div className="bg-white rounded-xl border border-forest/10 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="bg-neutral-100/80 px-6 py-3.5 border-b border-forest/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neutral-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                        Track 1: Literal Translation (Baseline)
                      </h3>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-600 font-medium">
                      Word-for-Word
                    </span>
                  </div>

                  <div className="p-6">
                    <p
                      className="text-lg text-neutral-700 leading-relaxed mb-4"
                      style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                    >
                      {currentVersion.literalTranslation}
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200/80 text-xs text-neutral-600 space-y-1.5">
                      <p className="font-semibold text-graphite">Linguistic Critique:</p>
                      <p>
                        Grammatically accurate, but reads like a dubbed translation (&ldquo;ఆరోగ్యం అనే బహుమతి ఇవ్వండి&rdquo;). Lacks regional warmth and household emotional resonance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200/60 flex items-center justify-between text-2xs text-neutral-500">
                  <span>Used as semantic anchor for back-translation</span>
                  <span>Factual Match: 100%</span>
                </div>
              </div>

              {/* Right Column: Natural Regional Adaptation */}
              <div className="bg-white rounded-xl border-2 border-forest overflow-hidden shadow-md flex flex-col justify-between">
                <div>
                  <div className="bg-forest text-ivory px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-brass" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Track 2: Natural Regional Adaptation (Recommended)
                      </h3>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded bg-brass text-forest font-bold">
                      Active Candidate ({currentVersion.id})
                    </span>
                  </div>

                  <div className="p-6">
                    {!isEditing ? (
                      <p
                        className="text-lg text-graphite leading-relaxed mb-4"
                        style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                      >
                        {currentVersion.naturalAdaptation}
                      </p>
                    ) : (
                      <div className="space-y-3 mb-4">
                        <textarea
                          rows={4}
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full p-3 rounded-lg border border-forest/30 text-base focus:outline-none focus:ring-2 focus:ring-forest"
                          style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                        />
                        <input
                          type="text"
                          placeholder="Reason for edit (e.g., Adjusted regional idiom or removed risky claim)..."
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-forest/20 text-xs"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="primary" onClick={handleSaveManualEdit}>
                            Save as New Version (v{campaign.versions.length + 1})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setEditedText(currentVersion.naturalAdaptation);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Adaptation Rationale Cards */}
                    <div className="bg-sage/15 rounded-lg p-4 border border-sage-300/40 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-forest flex items-center gap-1.5">
                        <Info size={14} /> Cultural Adaptation Rationale
                      </h4>
                      {currentVersion.adaptationRationale.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded p-3 border border-forest/10 text-xs space-y-1"
                        >
                          <p className="font-semibold text-forest">{item.change}</p>
                          <p className="text-neutral-600">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-ivory border-t border-forest/10 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                    icon={<RefreshCw size={13} />}
                  >
                    Edit Copy (Creates v{campaign.versions.length + 1})
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/campaigns/${campaign.id}/guardian`)}
                    iconRight={<ChevronRight size={14} />}
                  >
                    Proceed to Brand Guardian →
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
