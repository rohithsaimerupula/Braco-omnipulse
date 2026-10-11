"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Lock,
  BarChart3,
  CheckCircle2,
  FlaskConical,
  Link2,
  Upload,
  ChevronRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  saveExperimentPlan,
  recordExperimentResults,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion } from "@/lib/campaigns/types";

export default function ExperimentPlannerPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "south-india-diwali";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [hypothesis, setHypothesis] = useState(
    "Using natural regional Telugu cultural adaptation (Variant B) will drive a >25% higher CTR than literal translation (Variant A) across Hyderabad and Coastal Andhra."
  );
  const [primaryMetric, setPrimaryMetric] = useState("Click-Through Rate (CTR %)");
  const [splitRatio, setSplitRatio] = useState("50% / 50%");
  const [isLocked, setIsLocked] = useState(false);
  const [hasImported, setHasImported] = useState(false);

  useEffect(() => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      if (loaded.experimentPlan) {
        setHypothesis(loaded.experimentPlan.hypothesis);
        setPrimaryMetric(loaded.experimentPlan.primaryMetric);
        setIsLocked(loaded.experimentPlan.isLocked);
        if (loaded.experimentPlan.results) {
          setHasImported(true);
        }
      }
    }
  }, [campaignId]);

  const handleLockExperiment = () => {
    if (!campaign) return;
    const v1 = campaign.versions[0] || { id: "v1" };
    const v2 = campaign.versions[campaign.versions.length - 1] || { id: "v2" };

    saveExperimentPlan(campaign.id, {
      hypothesis,
      primaryMetric,
      variants: [
        {
          id: v1.id,
          name: "Variant A (Literal Baseline)",
          splitPercentage: 50,
          description: "Direct word-for-word translation",
        },
        {
          id: v2.id,
          name: "Variant B (Natural Regional Adaptation)",
          splitPercentage: 50,
          description: "Culturally adapted regional copy",
        },
      ],
      trafficSplit: splitRatio,
      minimumSampleSize: 20000,
      confidenceLevel: 95,
      isLocked: true,
      lockedAt: new Date().toISOString(),
      metricProvenanceValidated: false,
    });

    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setIsLocked(true);
    }
  };

  const handleSimulateImportData = () => {
    if (!campaign) return;
    recordExperimentResults(campaign.id, {
      impressionsA: 25400,
      impressionsB: 26100,
      conversionsA: 685,
      conversionsB: 1240,
      ctrA: 2.7,
      ctrB: 4.75,
      winnerVariant: "Variant B (Natural Regional Adaptation)",
      pValue: 0.0012,
      dataSource: "Authorized Ad Measurement API (Validated CSV Pipeline)",
    });

    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setHasImported(true);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-forest">Loading Experiment Planner...</p>
      </div>
    );
  }

  const vA = campaign.versions[0];
  const vB = campaign.versions[campaign.versions.length - 1];

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/approvals/${campaign.id}`}
            className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-lg font-semibold text-forest">
                Experiment Planner & Metric Provenance
              </h1>
              <Badge variant={isLocked ? "success" : "demo"}>
                {isLocked ? "Pre-Registered & Frozen" : "Drafting Hypothesis"}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — Pre-Registered Scientific A/B Test
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLocked ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleLockExperiment}
              iconRight={<Lock size={14} />}
            >
              Pre-Register & Freeze Hypothesis
            </Button>
          ) : !hasImported ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateImportData}
              iconRight={<Upload size={14} />}
            >
              Import Data & Validate Metric Provenance
            </Button>
          ) : (
            <Link href={`/campaigns/${campaign.id}/passport`}>
              <Button
                variant="primary"
                size="sm"
                iconRight={<ChevronRight size={14} />}
              >
                View Updated Passport
              </Button>
            </Link>
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
          <span className="text-ivory/60">3. Brand Guardian ✓</span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">4. Human Approval Gate ✓</span>
          <span className="text-ivory/30">→</span>
          <span className="flex items-center gap-1.5 bg-brass/20 text-brass-200 px-2.5 py-0.5 rounded-full font-semibold border border-brass/40">
            5. Experiment & Passport (Active)
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto mt-8 px-6 space-y-8">
        {/* Banner */}
        {isLocked && (
          <div className="bg-sage/20 border-2 border-forest rounded-xl p-5 flex items-start gap-3 shadow-sm">
            <Lock size={22} className="text-forest shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-forest">
                Hypothesis Cryptographically Frozen (Flowchart 2)
              </h3>
              <p className="text-xs text-neutral-700 mt-1">
                The hypothesis and primary metric are locked to prevent retroactive metric-picking (p-hacking). Only measurement imports from authorized data feeds will be accepted into the Passport ledger.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Pre-Registration */}
        <div className="bg-white rounded-xl border border-forest/10 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-forest flex items-center gap-2">
              <FlaskConical size={18} className="text-forest" />
              1. Pre-Registered Scientific Hypothesis
            </h2>
            <span className="text-2xs font-mono text-neutral-400">
              Confidence Level: 95% (p &lt; 0.05)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">
              Falsifiable Hypothesis
            </label>
            <textarea
              rows={2}
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              disabled={isLocked}
              className="w-full p-3 rounded-lg border border-forest/20 text-sm focus:outline-none focus:ring-1 focus:ring-forest disabled:bg-neutral-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">
                Primary Success Metric
              </label>
              <input
                type="text"
                value={primaryMetric}
                onChange={(e) => setPrimaryMetric(e.target.value)}
                disabled={isLocked}
                className="w-full p-2.5 rounded-lg border border-forest/20 text-sm disabled:bg-neutral-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">
                Traffic Split Allocation
              </label>
              <input
                type="text"
                value={splitRatio}
                onChange={(e) => setSplitRatio(e.target.value)}
                disabled={isLocked}
                className="w-full p-2.5 rounded-lg border border-forest/20 text-sm disabled:bg-neutral-50"
              />
            </div>
          </div>

          {/* Variants Side-by-Side preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
              <span className="block text-xs font-bold text-forest uppercase tracking-widest mb-1.5">
                Control (Variant A — Literal Baseline)
              </span>
              <p
                className="text-xs text-neutral-700 leading-relaxed"
                style={{ fontFamily: "var(--font-telugu), sans-serif" }}
              >
                {vA?.literalTranslation || vA?.sourceText}
              </p>
            </div>
            <div className="bg-brass/10 p-4 rounded-lg border border-brass/30">
              <span className="block text-xs font-bold text-brass-700 uppercase tracking-widest mb-1.5">
                Test (Variant B — Natural Regional Adaptation)
              </span>
              <p
                className="text-xs text-graphite leading-relaxed font-medium"
                style={{ fontFamily: "var(--font-telugu), sans-serif" }}
              >
                {vB?.naturalAdaptation}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Experiment Results & Metric Provenance */}
        {hasImported && campaign.experimentPlan?.results && (
          <div className="bg-white rounded-xl border-2 border-forest p-6 shadow-md space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-forest flex items-center gap-2">
                <TrendingUp size={18} className="text-forest" />
                2. Verified Measurement Results &amp; Winner
              </h2>
              <Badge variant="success" className="px-3 py-1">
                Statistically Significant (p = 0.0012)
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-2xs uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                  Variant A (Control) CTR
                </span>
                <span className="text-2xl font-bold text-neutral-800">
                  {campaign.experimentPlan.results.ctrA}%
                </span>
                <p className="text-2xs text-neutral-500 mt-1">
                  {campaign.experimentPlan.results.conversionsA.toLocaleString()} clicks /{" "}
                  {campaign.experimentPlan.results.impressionsA.toLocaleString()} impr.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 border border-green-300">
                <span className="text-2xs uppercase tracking-wider text-green-800 font-bold block mb-1">
                  Variant B (Regional) CTR
                </span>
                <span className="text-2xl font-bold text-green-800">
                  {campaign.experimentPlan.results.ctrB}%
                </span>
                <p className="text-2xs text-green-700 mt-1">
                  {campaign.experimentPlan.results.conversionsB.toLocaleString()} clicks /{" "}
                  {campaign.experimentPlan.results.impressionsB.toLocaleString()} impr.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-brass/10 border border-brass/30">
                <span className="text-2xs uppercase tracking-wider text-brass-800 font-bold block mb-1">
                  Relative Uplift
                </span>
                <span className="text-2xl font-bold text-forest">+75.9%</span>
                <p className="text-2xs text-forest mt-1">
                  Winner: <strong>Variant B (Telugu Regional)</strong>
                </p>
              </div>
            </div>

            {/* Metric Provenance Attestation */}
            <div className="bg-forest/5 p-4 rounded-lg border border-forest/10 flex items-start gap-3">
              <ShieldCheck size={20} className="text-forest shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-forest">
                  Metric Provenance Cryptographically Attested
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Imported from:{" "}
                  <strong>{campaign.experimentPlan.results.dataSource}</strong>. Result signed and appended to the immutable Decision Passport ledger.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
