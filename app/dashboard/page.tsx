"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  FileText,
  Plus,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { getStoredCampaigns } from "@/lib/campaigns/store";
import { Campaign } from "@/lib/campaigns/types";

const workflowMetrics = [
  {
    label: "Avg. time to approved draft",
    value: "4.2 hrs",
    delta: "-65%",
    detail: "vs manual baseline",
    positive: true,
  },
  {
    label: "Claims with verified evidence",
    value: "98.5%",
    delta: "+12%",
    detail: "last 30 days",
    positive: true,
  },
  {
    label: "Data quality issues caught",
    value: "14",
    delta: "+3",
    detail: "in import gate",
    positive: false,
  },
];

export default function DashboardOverviewPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest mb-1">
            Overview &amp; Campaign Control Center
          </h1>
          <p className="text-sm text-neutral-500">
            Welcome to your Braco OmniPulse workspace. Regional linguistic adaptation meets cryptographic brand governance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/campaigns/new">
            <Button variant="primary" size="sm" icon={<Plus size={16} />}>
              Create New Regional Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Workflow Metrics */}
      <section>
        <h2 className="text-sm font-semibold text-graphite mb-4 uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} className="text-forest" /> Workflow Metrics &amp; SLAs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowMetrics.map((metric, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm"
            >
              <p className="text-xs font-medium text-neutral-500 mb-2">
                {metric.label}
              </p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-serif text-forest">
                  {metric.value}
                </span>
                <span
                  className={`text-xs font-medium mb-1 ${
                    metric.positive ? "text-green-600" : "text-neutral-500"
                  }`}
                >
                  {metric.delta}
                </span>
              </div>
              <p className="text-2xs text-neutral-400 mt-1">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Campaigns */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-graphite uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-forest" /> Active Campaigns
            </h2>
            <Link
              href="/campaigns/new"
              className="text-xs font-medium text-forest hover:underline"
            >
              + Create Campaign
            </Link>
          </div>

          <div className="space-y-4">
            {campaigns.map((camp) => {
              const currentVer =
                camp.versions.find((v) => v.id === camp.currentVersionId) ||
                camp.versions[camp.versions.length - 1];
              const isApproved = currentVer.state === "Approved";

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm hover:border-forest/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-forest text-base">
                        {camp.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {camp.brief.targetLanguage} ({camp.brief.region}) • {camp.brief.format}
                      </p>
                    </div>
                    <Badge variant={isApproved ? "success" : "demo"}>
                      v{currentVer.versionNumber} • {currentVer.state}
                    </Badge>
                  </div>

                  <p
                    className="text-sm text-graphite line-clamp-2 my-3 p-2.5 rounded bg-ivory/60 border border-forest/5"
                    style={{ fontFamily: "var(--font-telugu), sans-serif" }}
                  >
                    {currentVer.naturalAdaptation}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forest/5 text-xs text-neutral-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-forest" />
                        <span>{camp.brief.claimAtoms.length} Claim Atoms</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-2xs text-neutral-400">
                        <GitBranch size={13} />
                        <span>{camp.versions.length} versions</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/campaigns/${camp.id}/studio`}>
                        <Button variant="outline" size="xs">
                          Studio
                        </Button>
                      </Link>
                      <Link href={`/campaigns/${camp.id}/guardian`}>
                        <Button variant="outline" size="xs">
                          Guardian
                        </Button>
                      </Link>
                      <Link href={`/approvals/${camp.id}`}>
                        <Button variant="outline" size="xs">
                          Approval
                        </Button>
                      </Link>
                      <Link href={`/campaigns/${camp.id}/passport`}>
                        <Button variant="primary" size="xs" iconRight={<ChevronRight size={12} />}>
                          Passport
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Activity Trace Preview */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-graphite uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} className="text-forest" /> Recent Decision Trace
          </h2>

          <div className="bg-sage/10 rounded-xl border border-sage-300/30 p-5 shadow-sm">
            <div className="relative border-l border-forest/20 ml-2 pl-5 space-y-5">
              {[
                {
                  event: "Experiment Pre-Registered",
                  time: "10 mins ago",
                  role: "Admin",
                },
                {
                  event: "Asset v2 Approved (Exact Hash Frozen)",
                  time: "12 mins ago",
                  role: "Compliance Lead",
                },
                {
                  event: "Guardian 4-Pass Check Complete",
                  time: "26 mins ago",
                  role: "Brand Guardian",
                },
                {
                  event: "Dual Translation Generated",
                  time: "28 mins ago",
                  role: "Adaptation Engine",
                },
                {
                  event: "Brief & Claim Atoms Locked",
                  time: "35 mins ago",
                  role: "Product Marketing",
                },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[25px] top-1.5 w-2 h-2 bg-forest rounded-full" />
                  <p className="text-sm font-medium text-graphite leading-tight">
                    {step.event}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {step.role} • {step.time}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/campaigns/south-india-diwali/passport">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-6"
                iconRight={<ChevronRight size={14} />}
              >
                View Full Decision Passport
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
