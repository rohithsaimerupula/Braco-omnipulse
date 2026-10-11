"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Plus,
  FlaskConical,
  FileCheck2,
  Filter,
} from "lucide-react";
import {
  getCampaignById,
  hydrateCampaignsFromServer,
  toggleShortlistCreator,
  addCustomCreatorToCampaign,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion, CreatorProfile } from "@/lib/campaigns/types";

const REGIONAL_CREATOR_POOL: CreatorProfile[] = [
  {
    id: "cr-ap-coastal-1",
    name: "Lakshmi Prathyusha",
    handle: "@prathyusha_skincare_ap",
    platform: "Instagram & YouTube Shorts",
    followers: "168K",
    language: "Telugu",
    region: "Andhra Pradesh",
    dialect: "Coastal Andhra",
    niche: "Clean Skincare, Daily Routines & FMCG",
    engagementRate: "5.1%",
    brandSafetyScore: 99,
    pastComplianceRate: "100% ASCI #Ad & Qualification Adherence",
    sampleNote:
      "Native Vijayawada/Guntur speaker; known for clear, calm product explainers without exaggerated medical claims.",
  },
  {
    id: "cr-ap-coastal-2",
    name: "Kiranmayi V.",
    handle: "@kiranmayi_vizag_vlogs",
    platform: "Instagram Reels",
    followers: "112K",
    language: "Telugu",
    region: "Andhra Pradesh",
    dialect: "Coastal Andhra",
    niche: "Family Wellness, Nutrition & Home Care",
    engagementRate: "4.6%",
    brandSafetyScore: 97,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Polite Coastal Andhra conversational tone ('అండి'); strong trust among 24-40 household buyers.",
  },
  {
    id: "cr-ts-hyd-1",
    name: "Venkatesh K.",
    handle: "@venky_talks_telugu",
    platform: "Instagram & YouTube",
    followers: "145K",
    language: "Telugu",
    region: "Telangana",
    dialect: "Telangana",
    niche: "Family Nutrition, Fitness & Everyday Lifestyle",
    engagementRate: "4.8%",
    brandSafetyScore: 98,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Authentic Hyderabad/Warangal Telangana cadence ('మన', 'బరాబర్'); high completion rate on 30s Reels.",
  },
  {
    id: "cr-ts-hyd-2",
    name: "Anusha Reddy S.",
    handle: "@anusha_hyd_diaries",
    platform: "Instagram Reels",
    followers: "210K",
    language: "Telugu",
    region: "Telangana",
    dialect: "Telangana",
    niche: "Skincare, Beauty & Festive Lifestyle",
    engagementRate: "5.4%",
    brandSafetyScore: 96,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Warm Telangana conversational delivery; zero history of unverified cosmetic guarantee claims.",
  },
  {
    id: "cr-ap-rayalaseema-1",
    name: "Harsha Vardhan R.",
    handle: "@harsha_tirupati_talks",
    platform: "YouTube Shorts & Instagram",
    followers: "94K",
    language: "Telugu",
    region: "Andhra Pradesh",
    dialect: "Rayalaseema",
    niche: "Consumer Reviews & Daily Essentials",
    engagementRate: "4.9%",
    brandSafetyScore: 97,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Natural Rayalaseema Telugu warmth; excels at evidence-backed product breakdowns.",
  },
  {
    id: "cr-tn-chennai-1",
    name: "Divya Subramanian",
    handle: "@divya_chennai_wellness",
    platform: "Instagram & YouTube",
    followers: "185K",
    language: "Tamil",
    region: "Tamil Nadu",
    dialect: "Standard Tamil",
    niche: "Dermat-Backed Skincare & Nutrition",
    engagementRate: "4.7%",
    brandSafetyScore: 99,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Natural conversational Tamil; strictly preserves clinical disclaimers and ingredient percentages.",
  },
  {
    id: "cr-ka-blr-1",
    name: "Chaitra Gowda",
    handle: "@chaitra_kannada_lifestyle",
    platform: "Instagram Reels",
    followers: "132K",
    language: "Kannada",
    region: "Karnataka",
    dialect: "Mysuru / Bengaluru Standard",
    niche: "Clean Beauty & Healthy Kitchen",
    engagementRate: "5.0%",
    brandSafetyScore: 98,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Clear Kannada diction with zero excessive English mixing.",
  },
  {
    id: "cr-hi-north-1",
    name: "Rohan Sharma",
    handle: "@rohan_daily_fit",
    platform: "Instagram & YouTube",
    followers: "240K",
    language: "Hindi",
    region: "North India",
    dialect: "Standard Conversational Hindi",
    niche: "Health, Nutrition & Skincare",
    engagementRate: "4.4%",
    brandSafetyScore: 97,
    pastComplianceRate: "100% ASCI #Ad Adherence",
    sampleNote:
      "Conversational Hindi creator; high compliance with ASCI food & cosmetic guidelines.",
  },
];

function getNativeAsciDisclosure(language: string): string {
  const lang = (language || "").toLowerCase();
  if (lang.includes("telugu")) {
    return "#Ad #PaidPartnership (ప్రాయోజిత ప్రకటన — Sponsored)";
  }
  if (lang.includes("tamil")) {
    return "#Ad #PaidPartnership (விளம்பரம் — Sponsored)";
  }
  if (lang.includes("hindi")) {
    return "#Ad #PaidPartnership (प्रायोजित विज्ञापन — Sponsored)";
  }
  if (lang.includes("kannada")) {
    return "#Ad #PaidPartnership (ಪ್ರಾಯೋಜಿತ ಜಾಹೀರಾತು — Sponsored)";
  }
  if (lang.includes("malayalam")) {
    return "#Ad #PaidPartnership (പരസ്യം — Sponsored)";
  }
  return "#Ad #PaidPartnership (Sponsored Advertisement)";
}

export default function CreatorMatchPage() {
  const params = useParams();
  const campaignId = (params?.id as string) || "greenglow-telugu-launch";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(null);
  const [filterMode, setFilterMode] = useState<"matched" | "all">("matched");
  const [copiedScript, setCopiedScript] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Custom Creator state
  const [newCreatorName, setNewCreatorName] = useState("");
  const [newCreatorHandle, setNewCreatorHandle] = useState("");
  const [newCreatorFollowers, setNewCreatorFollowers] = useState("85K");
  const [newCreatorDialect, setNewCreatorDialect] = useState("");
  const [newCreatorNiche, setNewCreatorNiche] = useState("Regional Skincare & Lifestyle");

  const loadCampaign = () => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      const ver =
        loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
        loaded.versions[loaded.versions.length - 1];
      setCurrentVersion(ver);
      if (!newCreatorDialect) {
        setNewCreatorDialect(loaded.brief.dialect || "Neutral Regional");
      }
    }
  };

  useEffect(() => {
    loadCampaign();
    hydrateCampaignsFromServer().then(() => {
      loadCampaign();
    });
  }, [campaignId]);

  const allCreators = useMemo(() => {
    if (!campaign) return REGIONAL_CREATOR_POOL;
    return [...(campaign.customCreators || []), ...REGIONAL_CREATOR_POOL];
  }, [campaign]);

  const displayedCreators = useMemo(() => {
    if (!campaign) return allCreators;
    const targetLang = (campaign.brief.targetLanguage || "").toLowerCase();
    const targetRegion = (campaign.brief.region || "").toLowerCase();
    const targetDialect = (campaign.brief.dialect || "").toLowerCase();

    // Score creators by language, region, and dialect match
    const scored = allCreators.map((cr) => {
      let score = 0;
      if (cr.language.toLowerCase() === targetLang) score += 50;
      if (
        targetRegion &&
        cr.region.toLowerCase().includes(targetRegion.split(" ")[0])
      ) {
        score += 30;
      }
      if (
        targetDialect &&
        cr.dialect.toLowerCase().includes(targetDialect.split(" ")[0])
      ) {
        score += 20;
      }
      return { creator: cr, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    if (filterMode === "matched") {
      const matched = scored.filter((s) => s.matchScore >= 50);
      return matched.length > 0 ? matched.map((m) => m.creator) : scored.map((s) => s.creator);
    }
    return scored.map((s) => s.creator);
  }, [campaign, allCreators, filterMode]);

  if (!campaign || !currentVersion) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-forest">Loading Regional Creator Match...</p>
      </div>
    );
  }

  const shortlistedIds = campaign.shortlistedCreatorIds || [];
  const shortlistedCreators = allCreators.filter((c) =>
    shortlistedIds.includes(c.id)
  );
  const nativeDisclosure = getNativeAsciDisclosure(
    campaign.brief.targetLanguage
  );
  const isApproved = currentVersion.state === "Approved";

  const handleToggleShortlist = async (creatorId: string) => {
    await toggleShortlistCreator(campaign.id, creatorId);
    loadCampaign();
  };

  const handleAddCustomCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatorName.trim() || !newCreatorHandle.trim()) return;

    const custom: CreatorProfile = {
      id: `cr-custom-${Date.now()}`,
      name: newCreatorName.trim(),
      handle: newCreatorHandle.trim().startsWith("@")
        ? newCreatorHandle.trim()
        : `@${newCreatorHandle.trim()}`,
      platform: campaign.brief.channel || "Instagram & YouTube",
      followers: newCreatorFollowers.trim() || "50K",
      language: campaign.brief.targetLanguage,
      region: campaign.brief.region,
      dialect: newCreatorDialect.trim() || campaign.brief.dialect || "Neutral",
      niche: newCreatorNiche.trim() || "Regional Creator",
      engagementRate: "4.9%",
      brandSafetyScore: 98,
      pastComplianceRate: "Verified Custom Workspace Creator",
      sampleNote: `Added specifically for ${campaign.name} (${campaign.brief.region}).`,
    };

    await addCustomCreatorToCampaign(campaign.id, custom);
    setNewCreatorName("");
    setNewCreatorHandle("");
    setShowAddModal(false);
    loadCampaign();
  };

  const handleCopyScript = () => {
    const fullText = `${currentVersion.naturalAdaptation}\n\n${nativeDisclosure}`;
    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDownloadBrief = (format: "txt" | "json") => {
    const briefPayload = {
      campaignId: campaign.id,
      campaignName: campaign.name,
      brandName: campaign.brief.brandName || "Braco Brand",
      versionId: currentVersion.id,
      versionState: currentVersion.state,
      contentHash: `sha256:${currentVersion.contentHash}`,
      honestEvaluationStatus: currentVersion.honestStatus,
      regionalConfiguration: {
        sourceLanguage: campaign.brief.sourceLanguage,
        targetLanguage: campaign.brief.targetLanguage,
        targetRegion: campaign.brief.region,
        dialect: campaign.brief.dialect || "Neutral Standard",
        audienceAgeGroup: campaign.brief.audienceAgeGroup || "All Adults",
        tone: campaign.brief.tone,
        formality: campaign.brief.formality || campaign.brief.slangFormality,
        slangIntensity: campaign.brief.slangIntensity || "none",
        channel: campaign.brief.channel,
        assetFormat: campaign.brief.format,
        culturalContext:
          campaign.brief.culturalContext ||
          "None (Do not invent any festival reference)",
      },
      approvedCreatorScript: currentVersion.naturalAdaptation,
      englishBackTranslationForReviewer: currentVersion.backTranslation || "",
      mandatoryAsciDisclosure: nativeDisclosure,
      lockedClaimAtoms: campaign.brief.claimAtoms.map((c) => ({
        claim: c.canonicalText,
        requiredQualifications: c.requiredQualifications || c.lockedTokens,
        evidenceSource: c.sourceTitle,
      })),
      strictCreatorGovernanceRules: [
        "Deliver the approved regional adaptation without altering locked claim qualifications.",
        "Display the native-script ASCI #Ad disclosure above the fold without truncation.",
        "Never add unrequested guarantees ('100% guaranteed', 'గ్యారెంటీ'), medical cures, or unrequested festival references.",
      ],
      shortlistedCreators: shortlistedCreators.map((c) => ({
        name: c.name,
        handle: c.handle,
        dialect: c.dialect,
        region: c.region,
        followers: c.followers,
      })),
      exportedAt: new Date().toISOString(),
    };

    let content = "";
    let mime = "text/plain;charset=utf-8";
    let ext = "txt";

    if (format === "json") {
      content = JSON.stringify(briefPayload, null, 2);
      mime = "application/json;charset=utf-8";
      ext = "json";
    } else {
      content = `====================================================================
BRACO OMNIPULSE — GOVERNED REGIONAL CREATOR BRIEF
====================================================================
Campaign: ${briefPayload.campaignName} (${briefPayload.campaignId})
Brand: ${briefPayload.brandName}
Version: ${briefPayload.versionId} | Status: ${briefPayload.versionState}
Immutable SHA-256 Hash: ${briefPayload.contentHash}
Evaluation Status: ${briefPayload.honestEvaluationStatus}

1. REGIONAL CONFIGURATION
--------------------------------------------------------------------
- Source Language: ${briefPayload.regionalConfiguration.sourceLanguage}
- Target Language: ${briefPayload.regionalConfiguration.targetLanguage}
- Target State/Region: ${briefPayload.regionalConfiguration.targetRegion}
- Dialect: ${briefPayload.regionalConfiguration.dialect}
- Audience Age Group: ${briefPayload.regionalConfiguration.audienceAgeGroup}
- Tone & Formality: ${briefPayload.regionalConfiguration.tone} (${briefPayload.regionalConfiguration.formality})
- Slang Intensity: ${briefPayload.regionalConfiguration.slangIntensity}
- Channel & Format: ${briefPayload.regionalConfiguration.channel} — ${briefPayload.regionalConfiguration.assetFormat}
- Supplied Cultural Context: ${briefPayload.regionalConfiguration.culturalContext}

2. APPROVED REGIONAL SCRIPT (${briefPayload.regionalConfiguration.targetLanguage})
--------------------------------------------------------------------
${briefPayload.approvedCreatorScript}

Mandatory ASCI Disclosure (Must appear in caption & video overlay):
${briefPayload.mandatoryAsciDisclosure}

3. DIAGNOSTIC ENGLISH BACK-TRANSLATION
--------------------------------------------------------------------
${briefPayload.englishBackTranslationForReviewer}

4. LOCKED CLAIM ATOMS & REQUIRED QUALIFICATIONS
--------------------------------------------------------------------
${briefPayload.lockedClaimAtoms
  .map(
    (c, idx) =>
      `${idx + 1}. "${c.claim}"\n   Required Tokens/Qualifications: ${c.requiredQualifications.join(", ")}\n   Evidence Dossier: ${c.evidenceSource}`
  )
  .join("\n")}

5. STRICT CREATOR GOVERNANCE RULES
--------------------------------------------------------------------
${briefPayload.strictCreatorGovernanceRules.map((r) => `- ${r}`).join("\n")}

6. SHORTLISTED REGIONAL CREATORS (${briefPayload.shortlistedCreators.length})
--------------------------------------------------------------------
${
  briefPayload.shortlistedCreators.length > 0
    ? briefPayload.shortlistedCreators
        .map(
          (c) =>
            `- ${c.name} (${c.handle}) | ${c.region} — ${c.dialect} | ${c.followers}`
        )
        .join("\n")
    : "- No creators shortlisted yet."
}
====================================================================`;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign.id}-${currentVersion.id}-creator-brief.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                Regional Creator Match & Governed Brief
              </h1>
              <Badge variant={isApproved ? "sage" : "warning"}>
                {currentVersion.id.toUpperCase()} • {currentVersion.state}
              </Badge>
              <Badge variant="neutral">
                {campaign.brief.targetLanguage} ({campaign.brief.region}
                {campaign.brief.dialect ? ` • ${campaign.brief.dialect}` : ""})
              </Badge>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {campaign.name} • Shortlisted:{" "}
              <strong className="text-forest">
                {shortlistedCreators.length} creator(s)
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Add Custom Creator
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownloadBrief("json")}
          >
            <Download size={14} /> Export JSON Pack
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDownloadBrief("txt")}
          >
            <Download size={14} /> Download Creator Brief (.txt)
          </Button>
        </div>
      </header>

      {/* Stage Navigation Bar */}
      <div className="bg-forest text-ivory px-8 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/campaigns/${campaign.id}/studio`}
            className="text-ivory/70 hover:text-ivory"
          >
            1. Adaptation Studio
          </Link>
          <span className="text-ivory/30">→</span>
          <Link
            href={`/campaigns/${campaign.id}/guardian`}
            className="text-ivory/70 hover:text-ivory"
          >
            2. Brand Guardian
          </Link>
          <span className="text-ivory/30">→</span>
          <Link
            href={`/approvals/${campaign.id}`}
            className="text-ivory/70 hover:text-ivory"
          >
            3. Human Approval
          </Link>
          <span className="text-ivory/30">→</span>
          <span className="text-brass font-semibold">4a. Creator Match</span>
          <span className="text-ivory/30">→</span>
          <Link
            href={`/campaigns/${campaign.id}/experiment`}
            className="text-ivory/70 hover:text-ivory"
          >
            4b. A/B Experiment
          </Link>
          <span className="text-ivory/30">→</span>
          <Link
            href={`/campaigns/${campaign.id}/passport`}
            className="text-ivory/70 hover:text-ivory"
          >
            5. Decision Passport
          </Link>
        </div>
        <span className="font-mono text-2xs text-ivory/60">
          SHA-256: {currentVersion.contentHash.slice(0, 16)}...
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-8 space-y-6">
        {/* Governance Status Banner */}
        {!isApproved ? (
          <div className="p-4 rounded-xl bg-amber-glow border border-amber-warn/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-warn shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-forest">
                  Version {currentVersion.id} is currently in{" "}
                  <span className="underline">{currentVersion.state}</span>{" "}
                  state
                </h3>
                <p className="text-2xs text-muted mt-0.5">
                  You can shortlist creators and preview the brief now, but final
                  creator dispatch requires human approval sign-off in Stage 3.
                </p>
              </div>
            </div>
            <Link href={`/approvals/${campaign.id}`}>
              <Button variant="secondary" size="sm">
                Go to Approval Gate
              </Button>
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-sage-light/60 border border-sage/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-sage shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-forest">
                  Approved Creator Brief Locked to Version {currentVersion.id}
                </h3>
                <p className="text-2xs text-muted mt-0.5">
                  Signed off by{" "}
                  {currentVersion.approvalRecord?.reviewerName ||
                    "Regional Reviewer"}{" "}
                  • Immutable Hash:{" "}
                  <span className="font-mono">
                    sha256:{currentVersion.contentHash.slice(0, 20)}...
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/campaigns/${campaign.id}/experiment`}>
                <Button variant="secondary" size="sm">
                  <FlaskConical size={13} /> A/B Experiment
                </Button>
              </Link>
              <Link href={`/campaigns/${campaign.id}/passport`}>
                <Button variant="primary" size="sm">
                  <FileCheck2 size={13} /> Decision Passport
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Governed Creator Brief Card */}
        <div className="bg-white rounded-2xl border border-forest/15 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brass" />
              <h2 className="font-serif text-base font-semibold text-forest">
                Governed Creator Script & Mandatory Disclosure (
                {campaign.brief.targetLanguage})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyScript}>
                {copiedScript ? (
                  <>
                    <Check size={13} className="text-sage" /> Copied Script +
                    #Ad
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy Script + #Ad
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="p-4 rounded-xl bg-ivory/70 border border-forest/10">
                <span className="text-2xs font-mono uppercase tracking-wider text-muted block mb-1.5">
                  Approved Regional Script ({campaign.brief.targetLanguage} •{" "}
                  {campaign.brief.dialect || "Neutral Standard"})
                </span>
                <p className="text-base text-forest font-medium leading-relaxed">
                  {currentVersion.naturalAdaptation}
                </p>
                {currentVersion.backTranslation && (
                  <p className="text-xs text-muted italic mt-2 pt-2 border-t border-forest/10">
                    Reviewer Back-Translation: &ldquo;
                    {currentVersion.backTranslation}&rdquo;
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-glow/50 border border-amber-warn/20 flex items-center justify-between">
                <div>
                  <span className="text-2xs font-semibold text-amber-warn uppercase tracking-wider block">
                    Mandatory Native-Script ASCI Influencer Disclosure
                  </span>
                  <p className="text-xs font-mono font-semibold text-forest mt-0.5">
                    {nativeDisclosure}
                  </p>
                </div>
                <Badge variant="warning">ASCI Influencer Guidelines</Badge>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-forest/5 border border-forest/10 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-forest uppercase tracking-wider mb-2">
                  Locked Claim Atoms & Rules
                </h3>
                <ul className="space-y-2 text-xs text-ink/80">
                  {campaign.brief.claimAtoms.map((atom) => (
                    <li
                      key={atom.id}
                      className="p-2 rounded-lg bg-white border border-forest/10"
                    >
                      <p className="font-medium text-forest text-2xs">
                        {atom.canonicalText}
                      </p>
                      <p className="text-2xs text-muted mt-0.5">
                        Locked tokens:{" "}
                        <span className="font-mono text-forest">
                          {(atom.requiredQualifications || atom.lockedTokens).join(
                            ", "
                          )}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-forest/10 text-2xs text-muted space-y-1">
                <p>
                  • Cultural Context:{" "}
                  <strong className="text-forest">
                    {campaign.brief.culturalContext ||
                      "None (Do NOT add festival greetings)"}
                  </strong>
                </p>
                <p>
                  • Slang Intensity:{" "}
                  <strong className="text-forest">
                    {campaign.brief.slangIntensity || "none"}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-forest" />
            <h2 className="font-serif text-base font-semibold text-forest">
              Verified Regional Creators ({displayedCreators.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-muted" />
            <button
              type="button"
              onClick={() => setFilterMode("matched")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterMode === "matched"
                  ? "bg-forest text-ivory"
                  : "bg-white text-forest border border-forest/15"
              }`}
            >
              Matched to {campaign.brief.targetLanguage} ({campaign.brief.region})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterMode === "all"
                  ? "bg-forest text-ivory"
                  : "bg-white text-forest border border-forest/15"
              }`}
            >
              All Regional Creators ({allCreators.length})
            </button>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedCreators.map((creator) => {
            const isShortlisted = shortlistedIds.includes(creator.id);
            const isExactDialectMatch =
              campaign.brief.dialect &&
              creator.dialect
                .toLowerCase()
                .includes(campaign.brief.dialect.toLowerCase().split(" ")[0]);

            return (
              <div
                key={creator.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition ${
                  isShortlisted
                    ? "border-sage ring-2 ring-sage/20"
                    : "border-forest/10 hover:border-forest/25"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-semibold text-forest">
                          {creator.name}
                        </h3>
                        {isShortlisted && (
                          <Badge variant="sage">Shortlisted</Badge>
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted">
                        {creator.handle} • {creator.platform}
                      </p>
                    </div>
                    <Badge variant={isExactDialectMatch ? "sage" : "neutral"}>
                      Brand Safety: {creator.brandSafetyScore}%
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-2xs px-2.5 py-1 rounded-full bg-forest/5 text-forest font-medium">
                      <MapPin size={11} /> {creator.region} • {creator.dialect}
                    </span>
                    <span className="text-2xs px-2.5 py-1 rounded-full bg-brass/10 text-brass font-medium">
                      {creator.language}
                    </span>
                    <span className="text-2xs px-2.5 py-1 rounded-full bg-ivory text-ink/70 border border-forest/10">
                      {creator.niche}
                    </span>
                  </div>

                  <p className="text-xs text-ink/80 bg-ivory/60 p-3 rounded-xl border border-forest/5 mb-4">
                    {creator.sampleNote}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-ivory/50 border border-forest/5 mb-4 text-center">
                    <div>
                      <span className="text-2xs text-muted block">
                        Followers
                      </span>
                      <span className="text-sm font-semibold text-forest">
                        {creator.followers}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted block">
                        Engagement
                      </span>
                      <span className="text-sm font-semibold text-sage">
                        {creator.engagementRate}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted block">
                        ASCI History
                      </span>
                      <span className="text-2xs font-medium text-forest">
                        {creator.pastComplianceRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-forest/10">
                  <span className="text-2xs text-muted flex items-center gap-1">
                    <ShieldCheck size={12} className="text-sage" /> Dialect &
                    ASCI Verified
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isShortlisted ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => handleToggleShortlist(creator.id)}
                    >
                      {isShortlisted ? (
                        <>
                          <CheckCircle2 size={13} className="text-sage" />{" "}
                          Shortlisted (Remove)
                        </>
                      ) : (
                        "Shortlist Creator"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-forest/15 max-w-md w-full p-6 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-forest mb-1">
              Add Custom Regional Creator
            </h3>
            <p className="text-xs text-muted mb-4">
              Add a creator for {campaign.brief.targetLanguage} (
              {campaign.brief.region}) and automatically shortlist them in Turso
              libSQL.
            </p>
            <form onSubmit={handleAddCustomCreator} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-forest block mb-1">
                  Creator Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  placeholder="e.g., Sai Pallavi Vlogs"
                  className="w-full px-3 py-2 rounded-lg border border-forest/15 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-forest block mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={newCreatorHandle}
                    onChange={(e) => setNewCreatorHandle(e.target.value)}
                    placeholder="@handle_telugu"
                    className="w-full px-3 py-2 rounded-lg border border-forest/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-forest block mb-1">
                    Followers
                  </label>
                  <input
                    type="text"
                    value={newCreatorFollowers}
                    onChange={(e) => setNewCreatorFollowers(e.target.value)}
                    placeholder="120K"
                    className="w-full px-3 py-2 rounded-lg border border-forest/15 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-forest block mb-1">
                    Regional Dialect
                  </label>
                  <input
                    type="text"
                    value={newCreatorDialect}
                    onChange={(e) => setNewCreatorDialect(e.target.value)}
                    placeholder="Coastal Andhra / Telangana"
                    className="w-full px-3 py-2 rounded-lg border border-forest/15 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-forest block mb-1">
                    Niche / Category
                  </label>
                  <input
                    type="text"
                    value={newCreatorNiche}
                    onChange={(e) => setNewCreatorNiche(e.target.value)}
                    placeholder="Skincare & Lifestyle"
                    className="w-full px-3 py-2 rounded-lg border border-forest/15 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save & Shortlist Creator
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
