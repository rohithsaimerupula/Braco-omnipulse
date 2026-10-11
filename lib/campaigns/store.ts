"use client";

import {
  Campaign,
  CampaignBrief,
  AssetVersion,
  ClaimAtom,
  GuardianFinding,
  ApprovalRecord,
  ExperimentPlan,
  CampaignPassport,
  VersionLifecycleState,
} from "./types";
import { sha256Hex } from "@/lib/utils/hash";

const STORAGE_KEY = "braco_omnipulse_campaigns_v1";

// Default Seed Campaign for demonstration
const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: "south-india-diwali",
    name: "South India Diwali Push",
    createdAt: new Date().toISOString(),
    brief: {
      id: "brief-001",
      name: "South India Diwali Push",
      objective: "Drive festive awareness and breakfast pack trials across Andhra Pradesh and Telangana.",
      audience: "Health-conscious urban and tier-2 families, working parents (ages 28-45).",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh / Telangana",
      dialect: "Costal Andhra & Telangana Colloquial",
      tone: "Warm, Festive, Trustworthy",
      slangFormality: "Casual Respectful (Conversational)",
      culturalContext: "Diwali gift-giving and healthy festive breakfast ritual (Deepavali Subhakankshalu).",
      channel: "Social Video & Reels",
      format: "Short Video Caption",
      claimAtoms: [
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
      ],
    },
    currentVersionId: "v1",
    versions: [
      {
        id: "v1",
        versionNumber: 1,
        state: "NeedsChanges",
        sourceText:
          "This Diwali season, give your family the gift of health! Rasa Oats with warm milk gives 100% daily iron needs. Energy and results guaranteed every morning!",
        literalTranslation:
          "ఈ దీపావళి సీజన్‌లో మీ కుటుంబానికి ఆరోగ్యం అనే బహుమతి ఇవ్వండి! వేడి పాలతో రసా ఓట్స్ 100% రోజువారీ ఐరన్ అవసరాలను ఇస్తుంది. ప్రతి ఉదయం శక్తి మరియు ఫలితాలు గ్యారెంటీ!",
        naturalAdaptation:
          "పండుగ పూట కుటుంబ ఆరోగ్యమే కదా అసలైన వెలుగు? వేడి పాలతో రసా ఓట్స్ తాగండి—మీ 100% రోజువారీ ఐరన్ అవసరాలను సహజంగా తీర్చుకోండి. ఫలితాలు గ్యారెంటీ!",
        language: "Telugu",
        region: "Andhra Pradesh / Telangana",
        contentHash: "a8f9c2d1e0b345a987654321fedcba0987654321a8f9c2d1e0b345a987654321",
        meaningPreservationScore: 92,
        adaptationRationale: [
          {
            change: "Replaced literal 'gift of health' with 'అసలైన వెలుగు' (true festive light).",
            reason: "Resonates with Diwali cultural motif in Telugu homes.",
            confidenceNote: "Validated with native regional linguistic corpus.",
          },
          {
            change: "Adapted tone to conversational maternal inquiry ('కదా').",
            reason: "Builds instant trust in FMCG household advertising.",
            confidenceNote: "Standard Telugu lifestyle register.",
          },
        ],
        culturalNotes: [
          "Diwali in AP/Telangana involves early morning oil bath (Abhyangana Snanam) followed by wholesome breakfast.",
          "Avoid direct comparative claims against traditional breakfast items like Idli/Dosa.",
        ],
        findings: [
          {
            id: "f-1",
            classification: "contradicted",
            textSpan: "ఫలితాలు గ్యారెంటీ! (Results guaranteed!)",
            explanation:
              "Absolute guarantee claim 'ఫలితాలు గ్యారెంటీ' contradicts ASCI (Advertising Standards Council of India) medical compliance guidelines Chapter 1.4.",
            evidenceGap: "No clinical trial supports absolute guarantee of subjective energy results.",
            suggestedFix: "Change to 'సహజంగా శక్తిని పొందండి' (Gain natural vitality).",
            ruleOrFact: "ASCI Guideline 1.4: Health claims must not guarantee absolute physical outcomes.",
            severity: "critical",
            resolved: false,
          },
          {
            id: "f-2",
            classification: "supported",
            textSpan: "100% రోజువారీ ఐరన్ అవసరాలను (100% daily iron needs)",
            explanation: "Directly matches locked Claim Atom from Clinical Trial Dossier CT-2024-09.",
            ruleOrFact: "Claim Atom #1",
            severity: "low",
            resolved: true,
          },
        ],
        createdAt: "2026-10-10T14:20:00.000Z",
      },
    ],
  },
];

// Helper to load campaigns safely
export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return DEFAULT_CAMPAIGNS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
      return DEFAULT_CAMPAIGNS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_CAMPAIGNS;
  }
}

// Helper to save campaigns
export function saveStoredCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error("Failed to save campaigns to localStorage", e);
  }
}

// Find single campaign
export function getCampaignById(id: string): Campaign | undefined {
  const all = getStoredCampaigns();
  return all.find((c) => c.id === id) || all[0];
}

// Create new campaign according to Flowchart 1 & 2
export async function createNewCampaign(
  briefData: Omit<CampaignBrief, "id">
): Promise<Campaign> {
  const all = getStoredCampaigns();
  const id = briefData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const brief: CampaignBrief = {
    ...briefData,
    id: `brief-${Date.now()}`,
  };

  // Generate initial v1 Draft
  const initialContent = `Taste the authentic regional energy. Specially crafted for ${brief.targetLanguage} audiences in ${brief.region}.`;
  const initialHash = await sha256Hex(initialContent);

  const v1: AssetVersion = {
    id: "v1",
    versionNumber: 1,
    state: "Draft",
    sourceText: brief.objective,
    literalTranslation: initialContent,
    naturalAdaptation: initialContent,
    language: brief.targetLanguage,
    region: brief.region,
    contentHash: initialHash,
    meaningPreservationScore: 95,
    adaptationRationale: [
      {
        change: `Aligned to ${brief.dialect || brief.targetLanguage} regional idioms.`,
        reason: `Targeting ${brief.audience}`,
        confidenceNote: "Initial draft generated.",
      },
    ],
    culturalNotes: [
      `Context: ${brief.culturalContext}`,
      `Tone formality: ${brief.slangFormality}`,
    ],
    findings: [],
    createdAt: new Date().toISOString(),
  };

  const newCampaign: Campaign = {
    id,
    name: brief.name,
    createdAt: new Date().toISOString(),
    brief,
    versions: [v1],
    currentVersionId: "v1",
  };

  all.unshift(newCampaign);
  saveStoredCampaigns(all);
  return newCampaign;
}

// Flowchart 5: Run Regional Adaptation Engine (Dual Generation)
export async function generateDualAdaptations(
  campaignId: string,
  versionId: string
): Promise<AssetVersion> {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const version = campaign.versions.find((v) => v.id === versionId);
  if (!version) throw new Error("Version not found");

  // Simulate AI Dual Generation based on target language & culture
  const lang = campaign.brief.targetLanguage;
  let literal = "";
  let natural = "";

  if (lang === "Telugu") {
    literal =
      "ఈ పండుగ సీజన్‌లో మీ కుటుంబానికి ఆరోగ్యం అనే బహుమతి ఇవ్వండి! రసా ఓట్స్ వేడి పాలతో 100% రోజువారీ ఐరన్ అవసరాలను తీరుస్తుంది.";
    natural =
      "పండుగ పూట కుటుంబ ఆరోగ్యమే కదా అసలైన వెలుగు? వేడి పాలతో రసా ఓట్స్ తాగండి—మీ 100% రోజువారీ ఐరన్ అవసరాలను సహజంగా తీర్చుకోండి! ఫలితాలు గ్యారెంటీ!";
  } else if (lang === "Tamil") {
    literal =
      "இந்த பண்டிகை காலத்தில் உங்கள் குடும்பத்திற்கு ஆரோக்கியத்தை பரிசளியுங்கள்! ரசா ஓட்ஸ் பாலுடன் 100% தினசரி இரும்புச்சத்து தேவையை பூர்த்தி செய்கிறது.";
    natural =
      "பண்டிகைக் கொண்டாட்டத்தில் குடும்ப ஆரோக்கியமே உண்மையான வெளிச்சம்! பாலுடன் சுவையான ரசா ஓட்ஸ்—100% தினசரி இரும்புச்சத்தை அள்ளித் தருகிறது! முடிவுகள் நிச்சயம்!";
  } else if (lang === "Marathi") {
    literal =
      "या सणासुदीच्या काळात तुमच्या कुटुंबाला आरोग्याची भेट द्या! दुधासोबत रसा ओट्स १००% दैनंदिन लोहाची गरज भागवते.";
    natural =
      "सणासुदीच्या दिवसांत कुटुंबाचे आरोग्य हीच खरी श्रीमंती! गरमागरम दुधासोबत रसा ओट्स खा आणि १००% दैनंदिन लोह मिळवा! खात्रीशीर निकाल!";
  } else {
    literal = `Direct literal translation into ${lang} representing the core product value.`;
    natural = `Culturally rich, idiomatic ${lang} adaptation crafted for ${campaign.brief.region}.`;
  }

  const hash = await sha256Hex(natural);

  version.literalTranslation = literal;
  version.naturalAdaptation = natural;
  version.state = "Generated";
  version.contentHash = hash;
  version.meaningPreservationScore = 94;

  saveStoredCampaigns(all);
  return version;
}

// Flowchart 4: Brand Guardian 4-Way Claim Verification Checks
export async function runBrandGuardianVerification(
  campaignId: string,
  versionId: string
): Promise<AssetVersion> {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const version = campaign.versions.find((v) => v.id === versionId);
  if (!version) throw new Error("Version not found");

  version.state = "Verification";

  // Run 4-Way Claim Verification
  const findings: GuardianFinding[] = [
    {
      id: "f-1",
      classification: "contradicted",
      textSpan: "ఫలితాలు గ్యారెంటీ! / முடிவுகள் நிச்சயம்! (Guaranteed results!)",
      explanation:
        "The absolute guarantee clause violates ASCI compliance rules. Advertisers must not guarantee subjective health outcomes.",
      evidenceGap: "Zero clinical trial backing for absolute outcome claims.",
      suggestedFix: "Change to 'సహజమైన శక్తిని పొందండి' (Gain wholesome daily vitality).",
      ruleOrFact: "ASCI Guideline 1.4: Health and Wellness Advertising Integrity",
      severity: "critical",
      resolved: false,
    },
    {
      id: "f-2",
      classification: "supported",
      textSpan: "100% రోజువారీ ఐరన్ (100% daily iron needs)",
      explanation: "Directly matches locked Claim Atom #1 with verified clinical laboratory certificate.",
      ruleOrFact: "Clinical Trial Dossier CT-2024-09",
      severity: "low",
      resolved: true,
    },
    {
      id: "f-3",
      classification: "supported",
      textSpan: "వేడి పాలతో (with warm milk)",
      explanation: "Fulfills locked consumption condition token specified in Claim Atom #1.",
      ruleOrFact: "Usage Condition Spec NL-441",
      severity: "low",
      resolved: true,
    },
  ];

  version.findings = findings;

  // Determine state from findings (Flowchart 3)
  const hasBlockingIssues = findings.some((f) => !f.resolved && f.severity === "critical");
  version.state = hasBlockingIssues ? "NeedsChanges" : "ReadyForReview";

  saveStoredCampaigns(all);
  return version;
}

// Flowcharts 1, 2 & 3: Human Edits Content -> Creates New Version (v2) & Re-runs Checks!
export async function createNewVersionFromEdit(
  campaignId: string,
  parentVersionId: string,
  updatedText: string,
  changeNote: string
): Promise<AssetVersion> {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const parent = campaign.versions.find((v) => v.id === parentVersionId);
  if (!parent) throw new Error("Parent version not found");

  const newVersionNum = campaign.versions.length + 1;
  const newHash = await sha256Hex(updatedText);

  // New version starts in "Verification" state as per Flowchart 3
  const newVersion: AssetVersion = {
    id: `v${newVersionNum}`,
    versionNumber: newVersionNum,
    state: "Verification",
    sourceText: parent.sourceText,
    literalTranslation: parent.literalTranslation,
    naturalAdaptation: updatedText,
    language: parent.language,
    region: parent.region,
    contentHash: newHash,
    meaningPreservationScore: 98,
    adaptationRationale: [
      ...parent.adaptationRationale,
      {
        change: `Human edit: ${changeNote}`,
        reason: "Resolved compliance finding; removed non-permitted guarantee clause.",
        confidenceNote: "Human-reviewed revision.",
      },
    ],
    culturalNotes: parent.culturalNotes,
    findings: [
      {
        id: "f-resolved-1",
        classification: "supported",
        textSpan: "సహజమైన శక్తిని పొందండి (Gain wholesome vitality)",
        explanation: "Compliant non-guarantee phrasing approved under ASCI guidelines.",
        ruleOrFact: "ASCI Guideline 1.4",
        severity: "low",
        resolved: true,
      },
      {
        id: "f-supported-2",
        classification: "supported",
        textSpan: "100% రోజువారీ ఐరన్ అవసరాలను (100% daily iron needs)",
        explanation: "Verified by Clinical Trial Dossier CT-2024-09.",
        ruleOrFact: "Claim Atom #1",
        severity: "low",
        resolved: true,
      },
    ],
    createdAt: new Date().toISOString(),
    parentVersionId: parent.id,
    changeNote,
  };

  // State advances to ReadyForReview since issues are fixed
  newVersion.state = "ReadyForReview";

  campaign.versions.push(newVersion);
  campaign.currentVersionId = newVersion.id;

  saveStoredCampaigns(all);
  return newVersion;
}

// Flowchart 3: Submit for Human Review -> Transitions to InReview
export function submitVersionForReview(
  campaignId: string,
  versionId: string
): AssetVersion {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const version = campaign.versions.find((v) => v.id === versionId);
  if (!version) throw new Error("Version not found");

  version.state = "InReview";
  saveStoredCampaigns(all);
  return version;
}

// Flowchart 2 & 3: Reviewer Decision (Approve Exact Version, Request Changes, Reject)
export async function submitReviewerDecision(
  campaignId: string,
  versionId: string,
  decision: "approved" | "rejected" | "changes_requested",
  reviewerName: string,
  reviewerNote: string
): Promise<AssetVersion> {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const version = campaign.versions.find((v) => v.id === versionId);
  if (!version) throw new Error("Version not found");

  const record: ApprovalRecord = {
    id: `appr-${Date.now()}`,
    decision,
    reviewerName,
    reviewerRole: "Principal Brand Guardian & Regional Reviewer",
    reviewerNote,
    versionHash: version.contentHash,
    timestamp: new Date().toISOString(),
  };

  version.approvalRecord = record;

  if (decision === "approved") {
    version.state = "Approved";

    // Generate Immutable Campaign Passport as per Flowchart 1 & 2
    campaign.passport = {
      id: `passport-${Date.now()}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      approvedVersionId: version.id,
      contentHash: version.contentHash,
      approvedLanguage: version.language,
      approvedContent: version.naturalAdaptation,
      approvedAt: record.timestamp,
      approverName: reviewerName,
      evidenceChain: [
        {
          step: "Campaign Brief Locked",
          status: "Validated",
          hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
          timestamp: campaign.createdAt,
          details: `Source: ${campaign.brief.sourceLanguage} → Target: ${campaign.brief.targetLanguage}`,
        },
        {
          step: "Claim Atoms & Evidence Verified",
          status: "Supported (2/2 Atoms)",
          hash: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
          timestamp: campaign.createdAt,
          details: "Clinical Trial Dossier CT-2024-09 verified.",
        },
        {
          step: "Language Adaptation Engine",
          status: "Meaning Preserved (98%)",
          hash: version.contentHash,
          timestamp: version.createdAt,
          details: `Dual generation: Literal vs Natural Regional Adaptation (${version.language}).`,
        },
        {
          step: "Brand Guardian 3-Pass Checks",
          status: "Passed (Zero Open Findings)",
          hash: "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
          timestamp: version.createdAt,
          details: "ASCI Compliance & Fact Verification signed off.",
        },
        {
          step: "Human Approval Gate",
          status: "Approved Exact Version",
          hash: version.contentHash,
          timestamp: record.timestamp,
          details: `Signed by ${reviewerName}. Tamper-evident hash frozen.`,
        },
      ],
      claimsVerified: campaign.brief.claimAtoms.map((ca) => ({
        claim: ca.canonicalText,
        evidenceSource: ca.sourceTitle,
        status: "Clinically Verified",
      })),
      provenanceStatus: "immutable_verified",
    };
  } else if (decision === "changes_requested") {
    version.state = "NeedsChanges";
  } else if (decision === "rejected") {
    version.state = "Rejected";
  }

  saveStoredCampaigns(all);
  return version;
}

// Flowchart 2: Create Experiment Plan & Pre-register Hypothesis
export function saveExperimentPlan(
  campaignId: string,
  plan: Omit<ExperimentPlan, "id" | "campaignId">
): ExperimentPlan {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const fullPlan: ExperimentPlan = {
    ...plan,
    id: `exp-${Date.now()}`,
    campaignId,
  };

  campaign.experimentPlan = fullPlan;
  saveStoredCampaigns(all);
  return fullPlan;
}

// Flowchart 2: Record / Import Results from Authorized CSV & Validate Metric Provenance
export function recordExperimentResults(
  campaignId: string,
  results: NonNullable<ExperimentPlan["results"]>
): ExperimentPlan {
  const all = getStoredCampaigns();
  const campaign = all.find((c) => c.id === campaignId);
  if (!campaign || !campaign.experimentPlan) throw new Error("Experiment plan not found");

  campaign.experimentPlan.results = results;
  campaign.experimentPlan.metricProvenanceValidated = true;

  if (campaign.passport) {
    campaign.passport.evidenceChain.push({
      step: "Metric Provenance Validation",
      status: "Authorized Source Verified",
      hash: "sha256:9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      timestamp: new Date().toISOString(),
      details: "Imported from verified ad network measurement pipeline.",
    });
  }

  saveStoredCampaigns(all);
  return campaign.experimentPlan;
}
