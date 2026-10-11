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
  AlertTriangle,
  History,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  hydrateCampaignsFromTurso,
  generateDualAdaptations,
  createNewVersionFromEdit,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion } from "@/lib/campaigns/types";

export default function RegionalCreativeStudioPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "greenglow-telugu-launch";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    const applyCampaign = (loaded: Campaign | undefined) => {
      if (loaded) {
        setCampaign(loaded);
        const ver =
          loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
          loaded.versions[loaded.versions.length - 1];
        setCurrentVersion(ver);
        setEditedText(ver.naturalAdaptation);
      }
    };
    applyCampaign(getCampaignById(campaignId));
    hydrateCampaignsFromTurso().then(() => {
      applyCampaign(getCampaignById(campaignId));
    });
  }, [campaignId]);

  const handleRunEngine = async () => {
    if (!campaign || !currentVersion) return;
    setIsGenerating(true);
    setTimeout(async () => {
      const updatedVer = await generateDualAdaptations(
        campaign.id,
        currentVersion.id
      );
      const refreshed = getCampaignById(campaign.id);
      if (refreshed) {
        setCampaign(refreshed);
        setCurrentVersion(updatedVer);
        setEditedText(updatedVer.naturalAdaptation);
      }
      setIsGenerating(false);
    }, 600);
  };

  const handleSaveManualEdit = async () => {
    if (!campaign || !currentVersion) return;
    const newVer = await createNewVersionFromEdit(
      campaign.id,
      currentVersion.id,
      editedText,
      editNote || "Human reviewer correction in Studio"
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

  const honestStatus =
    currentVersion.honestStatus ||
    (currentVersion.findings.some((f) => !f.resolved)
      ? "Unsupported claim detected"
      : "Meaning check passed");

  const statusIsClean = honestStatus === "Meaning check passed";

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Sticky Header */}
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
                Regional Creative Studio &amp; Translation Comparison (A–H)
              </h1>
              <Badge variant={statusIsClean ? "success" : "demo"}>
                v{currentVersion.versionNumber} • {honestStatus}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — {campaign.brief.sourceLanguage} →{" "}
              {campaign.brief.targetLanguage} ({campaign.brief.region}
              {campaign.brief.dialect ? ` • ${campaign.brief.dialect}` : " • Dialect not specified"})
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
            {isGenerating ? "Adapting..." : "Re-run Regional Engine"}
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
            2. Translation Comparison A–H (Active)
          </span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">3. Brand Guardian Full-Copy Check</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">4. Human Approval Gate</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">5. Experiment &amp; Passport</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-8 px-6 space-y-8">
        {/* A. Original Source Copy & Regional Configuration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-forest uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> A. Original Source Copy (
                {campaign.brief.sourceLanguage})
              </h3>
              <span className="text-2xs font-mono text-neutral-400">
                Format: {campaign.brief.format} • Channel: {campaign.brief.channel}
              </span>
            </div>
            <p className="text-base text-graphite leading-relaxed bg-ivory/70 p-4 rounded-lg border border-forest/10">
              &ldquo;{currentVersion.sourceText}&rdquo;
            </p>

            {/* Locked Claim Atoms */}
            <div className="mt-4 pt-4 border-t border-forest/10">
              <h4 className="text-xs font-semibold text-forest mb-2 flex items-center gap-1.5">
                <Lock size={13} className="text-brass" /> Approved Claim Atoms &amp;
                Required Qualifications
              </h4>
              <div className="space-y-2">
                {campaign.brief.claimAtoms.map((atom) => (
                  <div
                    key={atom.id}
                    className="bg-sage/10 rounded-lg p-3 border border-sage-300/40 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-2 text-xs text-forest-800">
                      <CheckCircle2
                        size={15}
                        className="text-forest shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-medium">&ldquo;{atom.canonicalText}&rdquo;</p>
                        <p className="text-2xs text-neutral-500 mt-0.5">
                          Source: <strong>{atom.sourceTitle}</strong> • Locked
                          Tokens:{" "}
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
                    <Badge variant="success">{atom.evidenceStatus}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1 & Section 6: Separate Regional Config + Honest Evaluation Status */}
          <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-forest uppercase tracking-widest mb-4 flex items-center gap-2">
                <Languages size={15} /> Section 1: Regional Configuration
              </h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-forest/5">
                  <dt className="text-neutral-500">Source → Target</dt>
                  <dd className="font-semibold text-forest">
                    {campaign.brief.sourceLanguage} → {campaign.brief.targetLanguage}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-forest/5">
                  <dt className="text-neutral-500">Target Region / State</dt>
                  <dd className="font-semibold text-graphite">
                    {campaign.brief.region}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-forest/5">
                  <dt className="text-neutral-500">Optional Dialect</dt>
                  <dd className="font-medium text-graphite">
                    {campaign.brief.dialect || "None specified (Neutral)"}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-forest/5">
                  <dt className="text-neutral-500">Audience Age Group</dt>
                  <dd className="font-medium text-graphite">
                    {campaign.brief.audienceAgeGroup || "Not specified"}
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-forest/5">
                  <dt className="text-neutral-500">Formality &amp; Slang</dt>
                  <dd className="font-medium text-graphite">
                    {campaign.brief.formality || campaign.brief.slangFormality} (
                    {campaign.brief.slangIntensity || "none"})
                  </dd>
                </div>
                <div className="pt-1">
                  <dt className="text-neutral-500 mb-1">
                    Explicit Cultural Context
                  </dt>
                  <dd className="text-graphite bg-ivory p-2 rounded border border-forest/10 text-2xs">
                    {campaign.brief.culturalContext
                      ? campaign.brief.culturalContext
                      : "None supplied — festival insertion prohibited per Section 3."}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section 6: Honest Evaluation Status (No arbitrary 94% / 100%) */}
            <div className="mt-5 pt-4 border-t border-forest/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                  <ShieldCheck
                    size={14}
                    className={
                      statusIsClean ? "text-green-600" : "text-amber-600"
                    }
                  />
                  Honest Evaluation Status
                </span>
              </div>
              <div
                className={`p-2.5 rounded-lg border text-xs font-bold mb-2 ${
                  statusIsClean
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                {honestStatus}
              </div>
              <p className="text-2xs text-neutral-500 leading-relaxed">
                {currentVersion.evaluationMethodNote ||
                  "Evaluated via deterministic claim/qualification checklist. Back-translation is a diagnostic aid only; qualified regional reviewer sign-off required."}
              </p>
            </div>
          </div>
        </div>

        {/* B, C, D: Side-by-Side Comparison + English Back-Translation */}
        {isGenerating ? (
          <div className="bg-white rounded-xl border border-forest/10 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-sage-200 border-t-forest rounded-full animate-spin mb-4" />
            <h3 className="font-serif text-lg text-forest mb-1">
              Running Regional Language Quality &amp; Guardian Pipeline...
            </h3>
            <p className="text-xs text-neutral-500">
              Generating Literal Baseline, Natural Regional Adaptation, and
              Diagnostic Back-Translation
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-forest font-semibold">
                  Translation Comparison (B: Literal vs. C: Natural Regional vs.
                  D: Back-Translation)
                </h2>
                <p className="text-xs text-neutral-500">
                  Section 5: Inspect translation tracks, back-translation
                  diagnostic aid, claim diffs, and dialect warnings.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                <GitBranch size={14} className="text-forest" />
                SHA-256: {currentVersion.contentHash.slice(0, 14)}...
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: B. Literal Translation & D. Diagnostic Back-Translation */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-forest/10 overflow-hidden shadow-sm">
                  <div className="bg-neutral-100/80 px-6 py-3.5 border-b border-forest/10 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      B. Literal Translation (Direct Baseline)
                    </h3>
                    <span className="text-2xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-600 font-medium">
                      Clause-by-Clause
                    </span>
                  </div>
                  <div className="p-6">
                    <p
                      className="text-lg text-neutral-700 leading-relaxed"
                      style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                    >
                      {currentVersion.literalTranslation}
                    </p>
                  </div>
                </div>

                {/* D. English Back-Translation for Reviewer Assistance */}
                <div className="bg-white rounded-xl border border-forest/10 overflow-hidden shadow-sm">
                  <div className="bg-amber-50/70 px-6 py-3.5 border-b border-amber-200/60 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      D. English Back-Translation (Diagnostic Aid)
                    </h3>
                    <span className="text-2xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      Not Standalone Proof of Accuracy
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-sm text-graphite leading-relaxed bg-ivory/60 p-3.5 rounded-lg border border-forest/10">
                      {currentVersion.backTranslation ||
                        currentVersion.sourceText}
                    </p>
                    <p className="text-2xs text-neutral-500">
                      Note (Section 5): Back-translation assists non-native
                      reviewers in spotting added/omitted claims, but native
                      regional review is required to confirm idiomatic naturalness.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: C. Natural Regional Adaptation */}
              <div className="bg-white rounded-xl border-2 border-forest overflow-hidden shadow-md flex flex-col justify-between">
                <div>
                  <div className="bg-forest text-ivory px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-brass" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        C. Natural Regional Adaptation ({currentVersion.language})
                      </h3>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded bg-brass text-forest font-bold">
                      {currentVersion.id} •{" "}
                      {campaign.brief.dialect || "Neutral Standard"}
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
                          style={{
                            fontFamily: "var(--font-telugu), sans-serif",
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Reviewer correction note (e.g., Refined Coastal Andhra phrasing or removed unsupported claim)..."
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-forest/20 text-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={handleSaveManualEdit}
                          >
                            Save Reviewer Correction (v
                            {campaign.versions.length + 1})
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

                    {/* Adaptation Rationale */}
                    <div className="bg-sage/15 rounded-lg p-4 border border-sage-300/40 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-forest flex items-center gap-1.5">
                        <Info size={14} /> Adaptation Rationale
                      </h4>
                      {currentVersion.adaptationRationale.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded p-3 border border-forest/10 text-xs space-y-1"
                        >
                          <p className="font-semibold text-forest">
                            {item.change}
                          </p>
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
                    Reviewer Edit (Creates v{campaign.versions.length + 1})
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      router.push(`/campaigns/${campaign.id}/guardian`)
                    }
                    iconRight={<ChevronRight size={14} />}
                  >
                    Proceed to Brand Guardian →
                  </Button>
                </div>
              </div>
            </div>

            {/* E, F, G, H: Meaning-Preservation Findings, Claim Diffs, Dialect Warnings, Reviewer Corrections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* E. Meaning-Preservation Findings & F. Added/Removed Claims */}
              <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                  <ShieldCheck size={15} /> E. Meaning-Preservation Findings &amp;
                  F. Claim Diffs
                </h3>

                <ul className="space-y-2 text-xs">
                  {(currentVersion.meaningPreservationFindings || []).map(
                    (f, i) => (
                      <li
                        key={i}
                        className="p-2.5 rounded bg-ivory/70 border border-forest/10 text-graphite"
                      >
                        {f}
                      </li>
                    )
                  )}
                </ul>

                {currentVersion.claimDiffs &&
                  currentVersion.claimDiffs.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-forest/10">
                      <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
                        F. Added / Preserved / Missing Claims:
                      </span>
                      {currentVersion.claimDiffs.map((cd, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded border text-xs flex items-start justify-between gap-2 ${
                            cd.type === "preserved"
                              ? "bg-green-50/70 border-green-200 text-green-900"
                              : "bg-red-50/80 border-red-200 text-red-900"
                          }`}
                        >
                          <div>
                            <span className="font-bold uppercase text-2xs mr-1.5">
                              [{cd.type.replace("_", " ")}]
                            </span>
                            <span>{cd.text}</span>
                            <p className="text-2xs opacity-80 mt-0.5">
                              {cd.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* G. Language & Dialect Warnings + H. Human Reviewer Corrections */}
              <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                  <AlertTriangle size={15} className="text-brass" /> G. Language
                  &amp; Dialect Warnings &amp; H. Reviewer Corrections
                </h3>

                {(currentVersion.languageDialectWarnings || []).length === 0 ? (
                  <p className="text-xs text-green-700 bg-green-50 p-3 rounded border border-green-200">
                    No dialect or English-mixing warnings detected for{" "}
                    {campaign.brief.dialect || currentVersion.language}.
                  </p>
                ) : (
                  <ul className="space-y-2 text-xs">
                    {currentVersion.languageDialectWarnings?.map((w, i) => (
                      <li
                        key={i}
                        className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900"
                      >
                        {w}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-2 border-t border-forest/10">
                  <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1 mb-2">
                    <History size={12} /> H. Human Reviewer Corrections Log:
                  </span>
                  {(!currentVersion.reviewerCorrections ||
                    currentVersion.reviewerCorrections.length === 0) ? (
                    <p className="text-2xs text-neutral-400 italic">
                      No manual reviewer edits recorded yet on this version chain.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentVersion.reviewerCorrections.map((rc, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded bg-ivory border border-forest/10 text-2xs space-y-1"
                        >
                          <p className="font-semibold text-forest">{rc.note}</p>
                          <p className="text-neutral-500">
                            Updated by {rc.reviewer} at{" "}
                            {new Date(rc.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 8: Honest Implementation Status Labeling */}
            <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
                  Section 8: Honest Implementation Status Ledger
                </h3>
                <Badge variant="neutral">
                  Transparent Architecture Disclosure
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-green-50/70 border border-green-200">
                  <span className="font-bold text-green-900 uppercase text-2xs block mb-1">
                    Implemented (Live)
                  </span>
                  <p className="text-2xs text-green-900/90 leading-relaxed">
                    11-field regional configuration, dialect non-inference,
                    cultural-context controls, complete-copy Brand Guardian
                    (7 detection categories), A–H translation comparison,
                    honest evaluation statuses, 12 regression tests, Turso
                    libSQL persistence, MyMemory neural API + Gemini/Sarvam
                    live adapters.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-900 uppercase text-2xs block mb-1">
                    Mocked-Demo (Fallback Fixtures)
                  </span>
                  <p className="text-2xs text-amber-900/90 leading-relaxed">
                    Zero-key offline fallback templates when external LLM keys
                    are not supplied; sample creator directory profiles and
                    sample ad-network telemetry presets alongside real CSV
                    upload.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-200">
                  <span className="font-bold text-neutral-800 uppercase text-2xs block mb-1">
                    Future Work
                  </span>
                  <p className="text-2xs text-neutral-600 leading-relaxed">
                    Multi-reviewer blind inter-annotator agreement scoring by
                    certified native regional linguists; direct OAuth webhook
                    streaming from live Meta/Google Ads production accounts.
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

