"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Wand2,
  RefreshCw,
  XCircle,
  HelpCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  runBrandGuardianVerification,
  createNewVersionFromEdit,
  submitVersionForReview,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion, GuardianFinding } from "@/lib/campaigns/types";

export default function BrandGuardianPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "south-india-diwali";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);

  useEffect(() => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      const ver =
        loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
        loaded.versions[loaded.versions.length - 1];
      setCurrentVersion(ver);
      if (ver.findings && ver.findings.length > 0) {
        setHasRun(true);
      }
    }
  }, [campaignId]);

  const handleRunGuardian = async () => {
    if (!campaign || !currentVersion) return;
    setIsRunning(true);
    setTimeout(async () => {
      const updated = await runBrandGuardianVerification(campaign.id, currentVersion.id);
      const refreshed = getCampaignById(campaign.id);
      if (refreshed) {
        setCampaign(refreshed);
        setCurrentVersion(updated);
      }
      setIsRunning(false);
      setHasRun(true);
    }, 1200);
  };

  const handleApplySuggestedFix = async (finding: GuardianFinding) => {
    if (!campaign || !currentVersion) return;
    setIsApplyingFix(true);

    let updatedText = currentVersion.naturalAdaptation;
    if (finding.suggestedFix) {
      const quotedMatch = finding.suggestedFix.match(/'([^']+)'/);
      const replacementPhrase = quotedMatch
        ? quotedMatch[1]
        : "సహజంగా శక్తిని పొందండి!";

      const prohibitedRegex =
        /ఫలితాలు గ్యారెంటీ!|ముగింపులు ఖాయం!|முடிவுகள் நிச்சயம்!|खात्रीशीर निकाल!|परिणामों की १००% गारंटी!|ಫಲಿತಾಂಶ ಗ್ಯಾರಂಟಿ!|ഫലം ഉറപ്പ്!|ফলাফলের গ্যারান্টি!|પરિણામની ગેરંટી!|ਨਤੀਜਿਆਂ ਦੀ ਗਾਰੰਟੀ!|ଫଳାଫଳ ଗ୍ୟାରେଣ୍ଟି!|గ్యారెంటీ|guarantee[d]?/gi;

      if (prohibitedRegex.test(updatedText)) {
        updatedText = updatedText.replace(prohibitedRegex, replacementPhrase);
      } else {
        updatedText = `${updatedText} ${replacementPhrase}`;
      }
    }

    const newVersion = await createNewVersionFromEdit(
      campaign.id,
      currentVersion.id,
      updatedText,
      `Resolved finding ${finding.id}: Replaced prohibited claim per ASCI Guideline 1.4`
    );

    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setCurrentVersion(newVersion);
    }
    setIsApplyingFix(false);
  };

  const handleSubmitForReview = () => {
    if (!campaign || !currentVersion) return;
    submitVersionForReview(campaign.id, currentVersion.id);
    router.push(`/approvals/${campaign.id}`);
  };

  if (!campaign || !currentVersion) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-forest">Loading Brand Guardian...</p>
      </div>
    );
  }

  const criticalIssues = currentVersion.findings.filter(
    (f) => !f.resolved && f.severity === "critical"
  );
  const supportedFindings = currentVersion.findings.filter(
    (f) => f.classification === "supported"
  );
  const hasUnresolvedIssues = criticalIssues.length > 0;

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/campaigns/${campaign.id}/studio`}
            className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-lg font-semibold text-forest">
                Brand Guardian & 4-Way Claim Verification
              </h1>
              <Badge variant={hasUnresolvedIssues ? "demo" : "success"}>
                v{currentVersion.versionNumber} • {currentVersion.state}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — Automated Claim & Cultural Guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunGuardian}
            disabled={isRunning}
            icon={<RefreshCw size={14} />}
          >
            {isRunning ? "Verifying..." : "Re-run 3-Pass Checks"}
          </Button>

          {!hasUnresolvedIssues ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitForReview}
              iconRight={<ChevronRight size={14} />}
            >
              Submit for Human Review
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Resolve Findings to Unlock Review
            </Button>
          )}
        </div>
      </header>

      {/* Lifecycle Stepper Banner */}
      <div className="bg-forest text-ivory px-8 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-6 max-w-6xl mx-auto w-full">
          <span className="text-ivory/60">1. Brief Locked ✓</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">2. Dual Adaptation ✓</span>
          <span className="text-ivory/30">→</span>
          <span className="flex items-center gap-1.5 bg-brass/20 text-brass-200 px-2.5 py-0.5 rounded-full font-semibold border border-brass/40">
            3. Brand Guardian 4-Way Check (Active)
          </span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">4. Human Approval Gate</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">5. Experiment & Passport</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-8 px-6 space-y-8">
        {/* Version Switcher and Content Under Review */}
        <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-forest/10">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-forest" />
                <h3 className="text-sm font-bold text-graphite">
                  Asset Copy Under Review (Version {currentVersion.versionNumber})
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Target Language: <strong>{currentVersion.language}</strong> • Dialect: {campaign.brief.dialect}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xs font-mono text-neutral-400">
                SHA: {currentVersion.contentHash.slice(0, 16)}...
              </span>
              {campaign.versions.length > 1 && (
                <div className="flex items-center gap-1.5 bg-forest/5 px-2.5 py-1 rounded-full text-xs font-semibold text-forest">
                  <GitBranch size={13} />
                  <span>{campaign.versions.length} versions generated</span>
                </div>
              )}
            </div>
          </div>

          <p
            className="text-lg text-graphite leading-relaxed bg-ivory/60 p-5 rounded-lg border border-forest/10"
            style={{ fontFamily: "var(--font-telugu), sans-serif" }}
          >
            {hasUnresolvedIssues ? (
              <>
                {currentVersion.naturalAdaptation.replace(
                  /ఫలితాలు గ్యారెంటీ!|ముగింపులు ఖాయం!/g,
                  ""
                )}
                <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold border border-red-300 inline-flex items-center gap-1 mx-1">
                  <ShieldAlert size={14} className="text-red-600 inline" />
                  ఫలితాలు గ్యారెంటీ!
                </span>
              </>
            ) : (
              currentVersion.naturalAdaptation
            )}
          </p>

          {currentVersion.parentVersionId && (
            <div className="mt-4 p-3 bg-sage/15 border border-sage-300 rounded-lg text-xs text-forest flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-600" />
                Derived from {currentVersion.parentVersionId}: &ldquo;{currentVersion.changeNote}&rdquo;
              </span>
              <span className="text-2xs font-mono text-neutral-500">
                Created: {new Date(currentVersion.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Brand Guardian Verification Pipeline Status */}
        {isRunning && (
          <div className="bg-white rounded-xl border border-forest/10 p-12 text-center space-y-4">
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest/10 border border-forest/20 flex flex-col items-center justify-center font-bold text-forest animate-pulse">
                Pass 1
              </div>
              <div
                className="w-12 h-12 rounded-xl bg-forest/10 border border-forest/20 flex flex-col items-center justify-center font-bold text-forest animate-pulse"
                style={{ animationDelay: "200ms" }}
              >
                Pass 2
              </div>
              <div
                className="w-12 h-12 rounded-xl bg-forest/10 border border-forest/20 flex flex-col items-center justify-center font-bold text-forest animate-pulse"
                style={{ animationDelay: "400ms" }}
              >
                Pass 3
              </div>
            </div>
            <p className="text-sm font-semibold text-forest">
              Running Deterministic, Cultural Slur, and ASCI Advertising Compliance Checks...
            </p>
          </div>
        )}

        {/* 4-Way Claim Verification Ledger (Flowchart 4) */}
        {!isRunning && hasRun && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-forest font-semibold flex items-center gap-2">
                  <ShieldCheck size={20} className="text-forest" />
                  Brand Guardian 4-Way Verification Ledger
                </h2>
                <p className="text-xs text-neutral-500">
                  Every claim is classified into: Supported, Unsupported, Contradicted, or Evidence Missing.
                </p>
              </div>

              {hasUnresolvedIssues ? (
                <Badge variant="demo" className="text-red-700 bg-red-100">
                  {criticalIssues.length} Finding Requires Revision
                </Badge>
              ) : (
                <Badge variant="success" className="px-3 py-1">
                  All 4 Passes Verified Clean ✓
                </Badge>
              )}
            </div>

            {/* Findings List */}
            <div className="space-y-4">
              {currentVersion.findings.map((finding) => (
                <div
                  key={finding.id}
                  className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                    finding.classification === "contradicted" ||
                    finding.classification === "unsupported"
                      ? "border-l-4 border-l-red-500 border-red-200 bg-red-50/20"
                      : "border-l-4 border-l-green-500 border-forest/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {finding.classification === "contradicted" ? (
                        <ShieldAlert size={22} className="text-red-500 shrink-0" />
                      ) : (
                        <CheckCircle2 size={22} className="text-green-600 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-bold text-graphite">
                            {finding.classification === "contradicted"
                              ? "4-Way Classification: CONTRADICTED (Prohibited Outcome Guarantee)"
                              : "4-Way Classification: SUPPORTED (Clinically Verified Claim)"}
                          </h4>
                          <span
                            className={`text-2xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              finding.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Rule/Authority: <strong>{finding.ruleOrFact}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-2xs font-mono text-neutral-400">
                      ID: {finding.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-bold mb-1">
                        Exact Text Span
                      </span>
                      <div
                        className={`p-3 rounded border text-sm ${
                          finding.classification === "contradicted"
                            ? "bg-white border-red-200 text-red-900 font-semibold"
                            : "bg-forest/5 border-forest/10 text-forest-800"
                        }`}
                        style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                      >
                        &ldquo;{finding.textSpan}&rdquo;
                      </div>
                    </div>

                    <div>
                      <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-bold mb-1">
                        Guardian Rationale & Evidence Gap
                      </span>
                      <p className="text-xs text-graphite leading-relaxed">
                        {finding.explanation}
                      </p>
                      {finding.evidenceGap && (
                        <p className="text-xs text-red-700 font-medium mt-1">
                          Evidence Gap: {finding.evidenceGap}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fix Branch for Contradicted / Unsupported Claims (Flowchart 4 Loop) */}
                  {finding.classification === "contradicted" && !finding.resolved && (
                    <div className="mt-4 pt-4 border-t border-red-200/60 bg-white p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-forest uppercase tracking-wider block mb-1">
                          Suggested Compliant Fix (Flowchart 4 Loop)
                        </span>
                        <p className="text-xs text-neutral-700">
                          {finding.suggestedFix}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApplySuggestedFix(finding)}
                        disabled={isApplyingFix}
                        icon={<Wand2 size={14} />}
                      >
                        {isApplyingFix
                          ? "Generating v2..."
                          : "Apply Fix & Create New Version (v2)"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* When Clean -> Show Review Submission CTA */}
            {!hasUnresolvedIssues && (
              <div className="bg-sage/20 border-2 border-forest rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={28} className="text-forest shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-forest">
                      All 4-Way Verification Checks Passed
                    </h3>
                    <p className="text-xs text-neutral-700 mt-1 max-w-xl">
                      Version {currentVersion.versionNumber} is 100% compliant with ASCI advertising standards, passes all deterministic fact checks, and preserves core meaning. Ready for human review.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmitForReview}
                  iconRight={<ChevronRight size={16} />}
                >
                  Submit for Reviewer Decision
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
