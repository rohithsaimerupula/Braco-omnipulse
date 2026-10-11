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
  ChevronRight,
  GitBranch,
  Wand2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  hydrateCampaignsFromTurso,
  runBrandGuardianVerification,
  createNewVersionFromEdit,
  submitVersionForReview,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion, GuardianFinding } from "@/lib/campaigns/types";

const SECTION_4_CATEGORIES = [
  {
    key: "unsupported_guarantee",
    label: "1. Unsupported guarantees",
    desc: "Detects '100% guaranteed', 'results guaranteed', 'గ్యారెంటీ', 'ఖాయం'",
  },
  {
    key: "new_factual_claim",
    label: "2. Newly introduced factual claims",
    desc: "Detects unapproved discounts, clinical numbers, or product features",
  },
  {
    key: "changed_or_exaggerated_claim",
    label: "3. Changed or exaggerated approved claims",
    desc: "Detects turning 'helps keep skin hydrated' into 'permanent instant cure'",
  },
  {
    key: "missing_qualification",
    label: "4. Missing qualifications",
    desc: "Ensures 'with regular use' / 'when consumed with milk' is preserved",
  },
  {
    key: "unsupported_health_or_env",
    label: "5. Unsupported health, environmental or superiority claims",
    desc: "Detects family-health implications, medical cures, or '#1 best' claims",
  },
  {
    key: "brief_contradiction",
    label: "6. Contradictions with the source brief",
    desc: "Detects negations, brand-name drops, or internal instruction leaks",
  },
  {
    key: "unrequested_cultural_ref",
    label: "7. Unrequested cultural or festival references",
    desc: "Blocks Sankranti, Ugadi, Diwali, Pongal, etc. unless supplied in brief",
  },
];

export default function BrandGuardianPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "greenglow-telugu-launch";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);
  const [isApplyingFix, setIsApplyingFix] = useState(false);

  const loadData = () => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      const ver =
        loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
        loaded.versions[loaded.versions.length - 1];
      setCurrentVersion(ver);
      setHasRun(true);
    }
  };

  useEffect(() => {
    loadData();
    hydrateCampaignsFromTurso().then(() => {
      loadData();
    });
  }, [campaignId]);

  const handleRunGuardian = async () => {
    if (!campaign || !currentVersion) return;
    setIsRunning(true);
    setTimeout(async () => {
      const updated = await runBrandGuardianVerification(
        campaign.id,
        currentVersion.id
      );
      const refreshed = getCampaignById(campaign.id);
      if (refreshed) {
        setCampaign(refreshed);
        setCurrentVersion(updated);
      }
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  const handleApplySuggestedFix = async (finding: GuardianFinding) => {
    if (!campaign || !currentVersion) return;
    setIsApplyingFix(true);

    let updatedText = currentVersion.naturalAdaptation;

    if (finding.category === "unsupported_guarantee") {
      updatedText = updatedText
        .replace(
          /ఫలితాలు గ్యారెంటీ!|ముగింపులు ఖాయం!|100%\s*గ్యారెంటీ!?|గ్యారెంటీ!?|results\s+guaranteed!?|100%\s*guaranteed!?|guaranteed!?/gi,
          ""
        )
        .replace(/\s{2,}/g, " ")
        .trim();
    } else if (finding.category === "unrequested_cultural_ref") {
      updatedText = updatedText
        .replace(
          /ఈ\s*(సంక్రాంతి|ఉగాది|దీపావళి|దసరా)\s*పండుగకు\s*/gi,
          ""
        )
        .replace(
          /సంక్రాంతి|ఉగాది|దీపావళి|దసరా|బోనాలు|బతుకమ్మ|diwali|sankranti|ugadi|pongal|dussehra/gi,
          ""
        )
        .replace(/\s{2,}/g, " ")
        .trim();
    } else if (
      finding.category === "unsupported_health_or_env" ||
      finding.category === "changed_or_exaggerated_claim" ||
      finding.category === "new_factual_claim"
    ) {
      updatedText = updatedText
        .replace(
          /కుటుంబ\s*ఆరోగ్యానికి\s*రక్షణ!?|శాశ్వతంగా\s*నయం\s*చేస్తుంది!?|మెడికల్\s*క్యూర్!?|family\s*health\s*protection!?|cures\s*all\s*skin\s*diseases!?/gi,
          ""
        )
        .replace(/\s{2,}/g, " ")
        .trim();
    } else if (finding.category === "missing_qualification") {
      const isTelugu = campaign.brief.targetLanguage
        .toLowerCase()
        .includes("telugu");
      const qualPhrase = isTelugu
        ? " క్రమం తప్పకుండా వాడితే (with regular use) సహాయపడుతుంది."
        : " with regular use.";
      if (!updatedText.includes(qualPhrase.trim())) {
        updatedText = `${updatedText.replace(/\.$/, "")}${qualPhrase}`;
      }
    } else if (
      finding.category === "brand_name_mismatch" &&
      campaign.brief.brandName
    ) {
      updatedText = `${campaign.brief.brandName} — ${updatedText}`;
    } else if (finding.suggestedFix) {
      const quotedMatch = finding.suggestedFix.match(/'([^']+)'/);
      if (quotedMatch && finding.textSpan) {
        updatedText = updatedText.replace(finding.textSpan, quotedMatch[1]);
      }
    }

    const newVersion = await createNewVersionFromEdit(
      campaign.id,
      currentVersion.id,
      updatedText,
      `Resolved Brand Guardian finding (${finding.category || finding.id}): ${finding.ruleOrFact}`
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

  // Section 4: Any unresolved non-supported finding blocks approval!
  const blockingIssues = currentVersion.findings.filter(
    (f) => !f.resolved && f.classification !== "supported"
  );
  const hasUnresolvedIssues = blockingIssues.length > 0;
  const honestStatus =
    currentVersion.honestStatus ||
    (hasUnresolvedIssues
      ? "Unsupported claim detected"
      : "Meaning check passed");

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
                Brand Guardian — Complete-Copy Verification (Section 4)
              </h1>
              <Badge variant={hasUnresolvedIssues ? "warning" : "success"}>
                v{currentVersion.versionNumber} • {honestStatus}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — Full-Copy Claim, Qualification &amp; Cultural
              Context Guardrails
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
            {isRunning ? "Verifying..." : "Re-Run Full-Copy Check"}
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
              Resolve {blockingIssues.length} Finding(s) to Unlock Review
            </Button>
          )}
        </div>
      </header>

      {/* Lifecycle Stepper Banner */}
      <div className="bg-forest text-ivory px-8 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-6 max-w-6xl mx-auto w-full">
          <span className="text-ivory/60">1. Brief Locked ✓</span>
          <span className="text-ivory/30">→</span>
          <Link
            href={`/campaigns/${campaign.id}/studio`}
            className="text-ivory/70 hover:text-ivory"
          >
            2. Translation Comparison A–H ✓
          </Link>
          <span className="text-ivory/30">→</span>
          <span className="flex items-center gap-1.5 bg-brass/20 text-brass-200 px-2.5 py-0.5 rounded-full font-semibold border border-brass/40">
            3. Complete-Copy Brand Guardian ({honestStatus})
          </span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">4. Human Approval Gate</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">5. Creator Match &amp; Passport</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-8 px-6 space-y-8">
        {/* Version Switcher and Complete Generated Copy Under Review */}
        <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-forest/10">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-forest" />
                <h3 className="text-sm font-bold text-graphite">
                  Complete Generated Copy Under Verification (Version{" "}
                  {currentVersion.versionNumber})
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Target Language: <strong>{currentVersion.language}</strong> •
                Region: <strong>{campaign.brief.region}</strong> • Dialect:{" "}
                <strong>
                  {campaign.brief.dialect ||
                    "Not specified (Neutral Regional Language)"}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xs font-mono text-neutral-400">
                SHA-256: {currentVersion.contentHash.slice(0, 16)}...
              </span>
              {campaign.versions.length > 1 && (
                <div className="flex items-center gap-1.5 bg-forest/5 px-2.5 py-1 rounded-full text-xs font-semibold text-forest">
                  <GitBranch size={13} />
                  <span>{campaign.versions.length} versions in chain</span>
                </div>
              )}
            </div>
          </div>

          <div
            className="text-lg text-graphite leading-relaxed bg-ivory/60 p-5 rounded-lg border border-forest/10"
            style={{ fontFamily: "var(--font-telugu), sans-serif" }}
          >
            {currentVersion.naturalAdaptation}
          </div>

          {blockingIssues.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {blockingIssues.map((bi) => (
                <span
                  key={bi.id}
                  className="bg-red-100 text-red-900 px-2.5 py-1 rounded-md text-xs font-semibold border border-red-300 inline-flex items-center gap-1.5"
                >
                  <ShieldAlert size={13} className="text-red-600 shrink-0" />
                  Flagged Span: &ldquo;{bi.textSpan}&rdquo; ({bi.category || bi.classification})
                </span>
              ))}
            </div>
          )}

          {/* Section 6 Honest Status & Evaluation Method */}
          <div className="mt-4 pt-4 border-t border-forest/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-forest">
                Section 6 Honest Evaluation Status:{" "}
              </span>
              <Badge variant={hasUnresolvedIssues ? "danger" : "success"}>
                {honestStatus}
              </Badge>
              <p className="text-2xs text-neutral-500 mt-1">
                {currentVersion.evaluationMethodNote ||
                  "Complete-copy rule checklist evaluation. A generated claim is never treated as verified merely because an approved claim atom appears elsewhere in the same text."}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: 7-Category Complete-Copy Detection Matrix */}
        <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-forest uppercase tracking-wider mb-1">
            Section 4: Complete-Copy Brand Guardian Detection Matrix
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Checks run across every sentence of the generated copy—not only on
            approved claim tokens.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SECTION_4_CATEGORIES.map((cat) => {
              const triggered = blockingIssues.some(
                (f) => f.category === cat.key
              );
              return (
                <div
                  key={cat.key}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                    triggered
                      ? "bg-red-50/70 border-red-300 text-red-900"
                      : "bg-ivory/50 border-forest/10 text-graphite"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{cat.label}</p>
                    <p className="text-2xs text-neutral-500 mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                  <Badge variant={triggered ? "danger" : "success"}>
                    {triggered ? "Flagged" : "Passed"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Findings List */}
        {!isRunning && hasRun && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-forest font-semibold flex items-center gap-2">
                  <ShieldCheck size={20} className="text-forest" />
                  Detailed Findings Ledger ({currentVersion.findings.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Every sentence &amp; claim classified into: Supported,
                  Unsupported, Contradicted, or Evidence Missing.
                </p>
              </div>

              {hasUnresolvedIssues ? (
                <Badge variant="danger">
                  {blockingIssues.length} Blocking Finding(s) Require Revision
                </Badge>
              ) : (
                <Badge variant="success" className="px-3 py-1">
                  Complete Copy Verified Clean ✓
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {currentVersion.findings.map((finding) => {
                const isBlocking =
                  finding.classification !== "supported" && !finding.resolved;
                return (
                  <div
                    key={finding.id}
                    className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                      isBlocking
                        ? "border-l-4 border-l-red-500 border-red-200 bg-red-50/20"
                        : "border-l-4 border-l-green-500 border-forest/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {isBlocking ? (
                          <ShieldAlert
                            size={22}
                            className="text-red-500 shrink-0"
                          />
                        ) : (
                          <CheckCircle2
                            size={22}
                            className="text-green-600 shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-sm font-bold text-graphite">
                              Classification:{" "}
                              {finding.classification.toUpperCase()}
                              {finding.category
                                ? ` (${finding.category.replace(/_/g, " ")})`
                                : ""}
                            </h4>
                            <span
                              className={`text-2xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                                isBlocking
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Rule / Authority:{" "}
                            <strong>{finding.ruleOrFact}</strong>
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
                          Evaluated Text Span
                        </span>
                        <div
                          className={`p-3 rounded border text-sm ${
                            isBlocking
                              ? "bg-white border-red-200 text-red-900 font-semibold"
                              : "bg-forest/5 border-forest/10 text-forest-800"
                          }`}
                          style={{
                            fontFamily: "var(--font-telugu), sans-serif",
                          }}
                        >
                          &ldquo;{finding.textSpan}&rdquo;
                        </div>
                      </div>

                      <div>
                        <span className="block text-2xs uppercase tracking-widest text-neutral-500 font-bold mb-1">
                          Guardian Explanation &amp; Evidence Gap
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

                    {isBlocking && (
                      <div className="mt-4 pt-4 border-t border-red-200/60 bg-white p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-forest uppercase tracking-wider block mb-1">
                            Suggested Compliant Fix
                          </span>
                          <p className="text-xs text-neutral-700">
                            {finding.suggestedFix ||
                              "Remove the unsupported/unrequested span and preserve only verified claim atoms."}
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
                            ? "Creating Clean Version..."
                            : `Apply Fix & Create v${campaign.versions.length + 1}`}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!hasUnresolvedIssues && (
              <div className="bg-sage/20 border-2 border-forest rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={28}
                    className="text-forest shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="text-base font-bold text-forest">
                      Complete-Copy Brand Guardian Checks Passed ({honestStatus})
                    </h3>
                    <p className="text-xs text-neutral-700 mt-1 max-w-xl">
                      Version {currentVersion.versionNumber} has zero
                      unsupported guarantees, zero unrequested festivals, and
                      preserves all locked claim qualifications. Ready for
                      qualified regional human review.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmitForReview}
                  iconRight={<ChevronRight size={16} />}
                >
                  Proceed to Human Approval Gate
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
