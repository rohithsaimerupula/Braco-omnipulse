// Master Types for Braco OmniPulse Campaign Engine
// Aligned with Master Flowchart, Lifecycle State Machine, Regional Language Quality Fix & Guardian Engine

export type VersionLifecycleState =
  | "Draft"
  | "Generated"
  | "Verification"
  | "NeedsChanges"
  | "ReadyForReview"
  | "InReview"
  | "Approved"
  | "Rejected";

export type HonestEvaluationStatus =
  | "Meaning check passed"
  | "Meaning check needs review"
  | "Unsupported claim detected"
  | "Dialect not verified"
  | "Human review required";

export interface ClaimAtom {
  id: string;
  canonicalText: string;
  lockedTokens: string[];
  requiredQualifications?: string[];
  sourceTitle: string;
  sourceUrl?: string;
  evidenceStatus:
    | "supported"
    | "unsupported"
    | "contradicted"
    | "evidence_missing";
}

export interface GuardianFinding {
  id: string;
  classification:
    | "supported"
    | "unsupported"
    | "contradicted"
    | "evidence_missing";
  category?:
    | "unsupported_guarantee"
    | "new_factual_claim"
    | "changed_or_exaggerated_claim"
    | "missing_qualification"
    | "unsupported_health_or_env"
    | "brief_contradiction"
    | "unrequested_cultural_ref"
    | "excessive_english_mixing"
    | "brand_name_mismatch"
    | "verified_claim";
  textSpan: string;
  explanation: string;
  evidenceGap?: string;
  suggestedFix?: string;
  ruleOrFact: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
}

export interface ApprovalRecord {
  id: string;
  decision: "approved" | "rejected" | "changes_requested";
  reviewerName: string;
  reviewerRole: string;
  reviewerNote: string;
  versionHash: string;
  timestamp: string;
}

export interface ClaimDiffEntry {
  type:
    | "preserved"
    | "added_unsupported"
    | "removed"
    | "missing_qualification"
    | "exaggerated";
  text: string;
  note: string;
}

export interface ReviewerCorrectionEntry {
  timestamp: string;
  reviewer: string;
  beforeText: string;
  afterText: string;
  note: string;
}

export interface AssetVersion {
  id: string;
  versionNumber: number; // 1, 2, 3...
  state: VersionLifecycleState;
  sourceText: string; // A. Original source copy
  literalTranslation: string; // B. Literal translation
  naturalAdaptation: string; // C. Natural regional adaptation
  backTranslation?: string; // D. English back-translation for reviewer assistance (diagnostic aid)
  meaningPreservationFindings?: string[]; // E. Meaning-preservation findings
  claimDiffs?: ClaimDiffEntry[]; // F. Added or removed claims
  languageDialectWarnings?: string[]; // G. Language and dialect warnings
  reviewerCorrections?: ReviewerCorrectionEntry[]; // H. Human reviewer corrections
  honestStatus?: HonestEvaluationStatus; // Section 6: Explicit honest evaluation status
  evaluationMethodNote?: string; // Documented evaluation method & limitations
  language: string;
  region: string;
  dialect?: string;
  contentHash: string; // SHA-256
  meaningPreservationScore: number; // Documented token/qualification overlap score (not arbitrary)
  adaptationRationale: Array<{
    change: string;
    reason: string;
    confidenceNote: string;
  }>;
  culturalNotes: string[];
  findings: GuardianFinding[];
  approvalRecord?: ApprovalRecord;
  createdAt: string;
  parentVersionId?: string;
  changeNote?: string;
}

export interface CampaignBrief {
  id: string;
  name: string;
  brandName?: string;
  objective: string;
  audience: string;
  audienceAgeGroup?: string; // Separate field per Requirement 1
  sourceLanguage: string; // Separate field per Requirement 1
  targetLanguage: string; // Separate field per Requirement 1
  region: string; // Target state or region per Requirement 1
  dialect?: string; // Optional dialect — never inferred from language alone
  tone: string; // Separate field per Requirement 1
  formality?: string; // Separate field per Requirement 1
  slangIntensity?: "none" | "light" | "moderate" | string; // Separate field per Requirement 1
  slangFormality: string; // Combined display summary
  culturalContext: string; // Explicitly supplied; if empty, no festival is added
  channel: string; // Marketing channel per Requirement 1
  format: string; // Asset format per Requirement 1
  claimAtoms: ClaimAtom[];
}

export interface ExperimentPlan {
  id: string;
  campaignId: string;
  hypothesis: string;
  primaryMetric: string;
  trafficSplit?: string;
  minimumSampleSize?: number;
  confidenceLevel?: number;
  variants: Array<{
    id: string;
    name: string;
    splitPercentage: number;
    description: string;
  }>;
  isLocked: boolean;
  lockedAt?: string;
  results?: {
    impressionsA: number;
    impressionsB: number;
    conversionsA: number;
    conversionsB: number;
    ctrA: number;
    ctrB: number;
    winnerVariant: string;
    pValue: number;
    dataSource: string;
  };
  metricProvenanceValidated?: boolean;
}

export interface CampaignPassport {
  id: string;
  campaignId: string;
  campaignName: string;
  approvedVersionId: string;
  contentHash: string;
  approvedLanguage: string;
  approvedContent: string;
  approvedAt: string;
  approverName: string;
  evidenceChain: Array<{
    step: string;
    status: string;
    hash: string;
    timestamp: string;
    details: string;
  }>;
  claimsVerified: Array<{
    claim: string;
    evidenceSource: string;
    status: string;
  }>;
  provenanceStatus: "immutable_verified" | "tamper_detected";
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  brief: CampaignBrief;
  versions: AssetVersion[];
  currentVersionId: string;
  experimentPlan?: ExperimentPlan;
  passport?: CampaignPassport;
}
