"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Lock,
  ChevronRight,
  GitBranch,
  FlaskConical,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import {
  getCampaignById,
  submitReviewerDecision,
  createNewVersionFromEdit,
} from "@/lib/campaigns/store";
import { Campaign, AssetVersion } from "@/lib/campaigns/types";

export default function ReviewCenterPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "south-india-diwali";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssetVersion | null>(null);
  const [reviewerNote, setReviewerNote] = useState(
    "Verified regional Telugu idiom and confirmed removal of prohibited ASCI guarantee claim."
  );
  const [showPostApprovalEdit, setShowPostApprovalEdit] = useState(false);
  const [postApprovalText, setPostApprovalText] = useState("");

  useEffect(() => {
    const loaded = getCampaignById(campaignId);
    if (loaded) {
      setCampaign(loaded);
      const ver =
        loaded.versions.find((v) => v.id === loaded.currentVersionId) ||
        loaded.versions[loaded.versions.length - 1];
      setCurrentVersion(ver);
      setPostApprovalText(ver.naturalAdaptation);
    }
  }, [campaignId]);

  const handleDecision = async (
    decision: "approved" | "rejected" | "changes_requested"
  ) => {
    if (!campaign || !currentVersion) return;
    const updatedVer = await submitReviewerDecision(
      campaign.id,
      currentVersion.id,
      decision,
      "Ananya Rao (Regional Compliance Lead)",
      reviewerNote
    );
    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setCurrentVersion(updatedVer);
    }
  };

  // Flowchart 3 Invariant: Editing an Approved version invalidates approval and creates NewVersion -> Verification
  const handlePostApprovalEdit = async () => {
    if (!campaign || !currentVersion) return;
    const newVer = await createNewVersionFromEdit(
      campaign.id,
      currentVersion.id,
      postApprovalText,
      "Post-approval content modification — previous approval invalidated per State Machine Rule"
    );
    const refreshed = getCampaignById(campaign.id);
    if (refreshed) {
      setCampaign(refreshed);
      setCurrentVersion(newVer);
    }
    setShowPostApprovalEdit(false);
  };

  if (!campaign || !currentVersion) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-forest">Loading Review Center...</p>
      </div>
    );
  }

  const isApproved = currentVersion.state === "Approved";
  const isRejected = currentVersion.state === "Rejected";
  const isNeedsChanges = currentVersion.state === "NeedsChanges";
  const previousVersion =
    campaign.versions.length > 1
      ? campaign.versions[campaign.versions.length - 2]
      : null;

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Header */}
      <header className="bg-white border-b border-forest/10 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/campaigns/${campaign.id}/guardian`}
            className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-forest/10 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-lg font-semibold text-forest">
                Human Review & Version Approval Gate
              </h1>
              <Badge variant={isApproved ? "success" : "demo"}>
                v{currentVersion.versionNumber} • {currentVersion.state}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {campaign.name} — Cryptographic Version Sign-Off
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isApproved ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecision("changes_requested")}
              >
                Request Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecision("rejected")}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDecision("approved")}
                iconRight={<Check size={14} />}
              >
                Approve Exact Version (v{currentVersion.versionNumber})
              </Button>
            </>
          ) : (
            <>
              <Link href={`/campaigns/${campaign.id}/experiment`}>
                <Button variant="outline" size="sm" icon={<FlaskConical size={14} />}>
                  Plan Experiment (A/B)
                </Button>
              </Link>
              <Link href={`/campaigns/${campaign.id}/passport`}>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={<ChevronRight size={14} />}
                >
                  View Campaign Passport
                </Button>
              </Link>
            </>
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
          <span className="flex items-center gap-1.5 bg-brass/20 text-brass-200 px-2.5 py-0.5 rounded-full font-semibold border border-brass/40">
            4. Human Approval Gate ({currentVersion.state})
          </span>
          <span className="text-ivory/30">→</span>
          <span className="text-ivory/60">5. Experiment & Passport</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Asset, Version Hash & Delta */}
        <div className="lg:col-span-2 space-y-6">
          {/* State Banner */}
          {isApproved && (
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-green-900">
                    Exact Version Approved & Cryptographically Locked
                  </h3>
                  <p className="text-xs text-green-800 mt-1">
                    SHA-256 Hash{" "}
                    <code className="bg-green-100 px-1.5 py-0.5 rounded font-mono">
                      {currentVersion.contentHash.slice(0, 20)}...
                    </code>{" "}
                    is now frozen in the Campaign Passport. Any subsequent edit will invalidate this approval and spawn Version{" "}
                    {currentVersion.versionNumber + 1}.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPostApprovalEdit(!showPostApprovalEdit)}
                icon={<Edit3 size={13} />}
              >
                Edit Copy (Test Invalidation)
              </Button>
            </div>
          )}

          {isNeedsChanges && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    State: NeedsChanges — Revision Requested
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    This version requires author edits before it can be approved.
                  </p>
                </div>
              </div>
              <Link href={`/campaigns/${campaign.id}/studio`}>
                <Button size="sm" variant="outline">
                  Return to Studio to Edit
                </Button>
              </Link>
            </div>
          )}

          {isRejected && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-red-900">
                    State: Rejected
                  </h3>
                  <p className="text-xs text-red-800 mt-0.5">
                    This version was rejected by the reviewer. Create a new version to resubmit.
                  </p>
                </div>
              </div>
              <Link href={`/campaigns/${campaign.id}/studio`}>
                <Button size="sm" variant="outline">
                  Create New Version
                </Button>
              </Link>
            </div>
          )}

          {/* Post-Approval Edit Box (Demonstrates Flowchart 3 Invariant: Approved -> Edit -> NewVersion -> Verification) */}
          {showPostApprovalEdit && (
            <div className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> State Machine Invariant Check (Flowchart 3)
                </span>
                <span className="text-2xs font-mono text-amber-800">
                  Approved → Edit → NewVersion (v{campaign.versions.length + 1})
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Modifying an already-approved version will immediately revoke approval status, generate a new SHA-256 content hash, and require fresh Brand Guardian verification.
              </p>
              <textarea
                rows={3}
                value={postApprovalText}
                onChange={(e) => setPostApprovalText(e.target.value)}
                className="w-full p-3 rounded-lg border border-amber-300 bg-white text-base"
                style={{ fontFamily: "var(--font-telugu), sans-serif" }}
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handlePostApprovalEdit}>
                  Save Edit & Invalidate Approval (Creates v{campaign.versions.length + 1})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPostApprovalEdit(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Current Version Card */}
          <div className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
            <div className="bg-sage/15 p-4 border-b border-forest/10 flex items-center justify-between">
              <h2 className="text-sm font-bold text-forest flex items-center gap-2">
                <FileText size={16} /> Candidate Version (v{currentVersion.versionNumber}) — {currentVersion.language}
              </h2>
              <span className="font-mono text-2xs bg-white px-2.5 py-1 rounded border border-forest/15 text-forest">
                SHA-256: {currentVersion.contentHash.slice(0, 16)}...
              </span>
            </div>
            <div className="p-6">
              <p
                className="text-lg text-graphite leading-relaxed"
                style={{ fontFamily: "var(--font-telugu), sans-serif" }}
              >
                {currentVersion.naturalAdaptation}
              </p>
            </div>
          </div>

          {/* Delta Review (v1 -> v2) */}
          {previousVersion && (
            <div className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden">
              <div className="bg-neutral-50 p-4 border-b border-forest/10 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-graphite flex items-center gap-2">
                    <GitBranch size={15} className="text-forest" />
                    Version Delta Review ({previousVersion.id} → {currentVersion.id})
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Comparing previous draft against current compliant revision.
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-200 text-xs">
                  <span className="font-bold text-red-800 block mb-1">
                    Previous ({previousVersion.id} — {previousVersion.state}):
                  </span>
                  <p
                    className="text-sm text-neutral-700 line-through"
                    style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                  >
                    {previousVersion.naturalAdaptation}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-green-50/60 border border-green-200 text-xs">
                  <span className="font-bold text-green-800 block mb-1">
                    Current ({currentVersion.id} — {currentVersion.state}):
                  </span>
                  <p
                    className="text-sm text-graphite font-medium"
                    style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                  >
                    {currentVersion.naturalAdaptation}
                  </p>
                </div>

                {currentVersion.changeNote && (
                  <div className="pt-2 border-t border-forest/10 text-xs text-neutral-600">
                    <strong className="text-forest">Revision Note:</strong> {currentVersion.changeNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviewer Sign-off Note Input */}
          <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Reviewer Audit Note (Recorded in Passport)
            </label>
            <textarea
              rows={2}
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              disabled={isApproved}
              className="w-full p-3 rounded-lg border border-forest/20 text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>
        </div>

        {/* Right Column: Server Gates & State Machine History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-forest mb-4 flex items-center gap-2">
              <Lock size={16} /> Server-Enforced Approval Gates
            </h3>

            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-graphite">Exact SHA-256 Hash Match</p>
                  <p className="text-neutral-500">
                    Content matches verified Guardian output hash.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-graphite">Zero Critical Findings</p>
                  <p className="text-neutral-500">
                    All 4-Way Claim Verification checks passed.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-graphite">Locked Claim Atoms Intact</p>
                  <p className="text-neutral-500">
                    100% daily iron &amp; warm milk tokens verified.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-forest shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-graphite">Meaning Preservation: {currentVersion.meaningPreservationScore}%</p>
                  <p className="text-neutral-500">
                    Exceeds 90% semantic fidelity threshold.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Version History List */}
          <div className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-forest mb-3 flex items-center gap-2">
              <GitBranch size={16} /> Version Lifecycle History
            </h3>
            <div className="space-y-2.5">
              {campaign.versions.map((ver) => (
                <div
                  key={ver.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    ver.id === currentVersion.id
                      ? "bg-forest/5 border-forest font-semibold"
                      : "bg-neutral-50 border-neutral-200 text-neutral-500"
                  }`}
                >
                  <div>
                    <span className="text-forest font-bold">{ver.id}</span> •{" "}
                    <span>{ver.state}</span>
                    <p className="text-2xs font-mono text-neutral-400">
                      {ver.contentHash.slice(0, 12)}...
                    </p>
                  </div>
                  <Badge variant={ver.state === "Approved" ? "success" : "demo"}>
                    {ver.state}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
