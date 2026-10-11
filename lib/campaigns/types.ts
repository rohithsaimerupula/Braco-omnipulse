// Master Types for Braco OmniPulse Campaign Engine
// Strictly aligned with Master Flowchart, Lifecycle State Machine & Guardian Engine

export type VersionLifecycleState =
  | "Draft"
  | "Generated"
  | "Verification"
  | "NeedsChanges"
  | "ReadyForReview"
  | "InReview"
  | "Approved"
  | "Rejected";

export interface ClaimAtom {
  id: string;
  canonicalText: string;
  lockedTokens: string[];
  sourceTitle: string;
  sourceUrl?: string;
  evidenceStatus: "supported" | "unsupported" | "contradicted" | "evidence_missing";
}

export interface GuardianFinding {
  id: string;
  classification: "supported" | "unsupported" | "contradicted" | "evidence_missing";
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

export interface AssetVersion {
  id: string;
  versionNumber: number; // 1, 2, 3...
  state: VersionLifecycleState;
  sourceText: string;
  literalTranslation: string;
  naturalAdaptation: string;
  language: string;
  region: string;
  contentHash: string; // SHA-256
  meaningPreservationScore: number; // 0 - 100%
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
  objective: string;
  audience: string;
  sourceLanguage: string;
  targetLanguage: string;
  region: string;
  dialect?: string;
  tone: string;
  slangFormality: string;
  culturalContext: string;
  channel: string;
  format: string;
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
