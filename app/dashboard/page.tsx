"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, ShieldCheck, Zap, Activity, ChevronRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const workflowMetrics = [
  { label: "Avg. time to approved draft", value: "4.2 hrs", delta: "-65%", detail: "vs manual baseline", positive: true },
  { label: "Claims with verified evidence", value: "98.5%", delta: "+12%", detail: "last 30 days", positive: true },
  { label: "Data quality issues caught", value: "14", delta: "+3", detail: "in import gate", positive: false },
];

export default function DashboardOverviewPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest mb-1">Overview</h1>
          <p className="text-sm text-neutral-500">Welcome to your Braco OmniPulse workspace.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/campaigns/new">
            <Button variant="primary" size="sm" iconLeft={<Plus size={16}/>}>New Campaign</Button>
          </Link>
        </div>
      </div>

      {/* Workflow Metrics (M8) */}
      <section>
        <h2 className="text-sm font-semibold text-graphite mb-4 uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} className="text-forest" /> Workflow Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowMetrics.map((metric, i) => (
            <div key={i} className="bg-white rounded-xl border border-forest/10 p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-500 mb-2">{metric.label}</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-serif text-forest">{metric.value}</span>
                <span className={`text-xs font-medium mb-1 ${metric.positive ? 'text-green-600' : 'text-neutral-500'}`}>
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
            <Link href="/campaigns" className="text-xs font-medium text-forest hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            {/* Seeded Demo Campaign */}
            <Link href="/campaigns/123/passport" className="block bg-white rounded-xl border border-forest/10 p-5 shadow-sm hover:border-forest/30 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-forest text-base group-hover:text-forest-600 transition-colors">South India Diwali Push</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Telugu & Marathi • Short Video</p>
                </div>
                <Badge variant="success">Approved</Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-forest/5 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-600"/> 0 Open Findings</div>
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-brass"/> Experiment Running</div>
              </div>
            </Link>

            {/* Empty State / Draft */}
            <div className="block bg-white rounded-xl border border-forest/10 p-5 shadow-sm opacity-60">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-graphite text-base">Q1 Brand Refresh</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Tamil • Social Feed</p>
                </div>
                <Badge variant="demo">Draft v1</Badge>
              </div>
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-forest/5 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-neutral-400"/> Not checked</div>
              </div>
            </div>
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
                { event: "Experiment Locked", time: "10 mins ago", role: "Admin" },
                { event: "Asset v2 Approved", time: "12 mins ago", role: "Admin" },
                { event: "Guardian Checked", time: "26 mins ago", role: "System" },
                { event: "Variants Generated", time: "28 mins ago", role: "AI Demo" }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[25px] top-1.5 w-2 h-2 bg-forest rounded-full"></div>
                  <p className="text-sm font-medium text-graphite leading-tight">{step.event}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{step.role} • {step.time}</p>
                </div>
              ))}
            </div>
            <Link href="/campaigns/123/passport">
              <Button variant="outline" size="sm" fullWidth className="mt-6" iconRight={<ChevronRight size={14}/>}>
                View Full Passport
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
