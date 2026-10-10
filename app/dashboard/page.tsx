import Link from "next/link";
import { Globe2, LayoutDashboard, BarChart3, Users, ShieldCheck, Settings, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Dashboard — Braco OmniPulse",
  description: "Braco OmniPulse campaign dashboard overview.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-forest text-ivory flex flex-col py-6 px-4 gap-1">
        <Link href="/" className="flex items-center gap-2 mb-8 px-2">
          <span className="w-7 h-7 rounded-md bg-ivory/10 flex items-center justify-center">
            <Globe2 size={14} className="text-brass" />
          </span>
          <span className="font-serif font-semibold text-ivory text-base">
            Braco <span className="text-brass">OmniPulse</span>
          </span>
        </Link>
        {[
          { icon: <LayoutDashboard size={15} />, label: "Overview", href: "/dashboard", active: true },
          { icon: <BarChart3 size={15} />, label: "Campaigns", href: "/dashboard" },
          { icon: <Users size={15} />, label: "Creators", href: "/dashboard" },
          { icon: <ShieldCheck size={15} />, label: "Approvals", href: "/dashboard" },
          { icon: <BarChart3 size={15} />, label: "Analytics", href: "/dashboard" },
          { icon: <Settings size={15} />, label: "Settings", href: "/dashboard" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.active
                ? "bg-ivory/10 text-ivory font-medium"
                : "text-ivory/50 hover:text-ivory hover:bg-ivory/5"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="mt-auto px-2 py-3 rounded-lg bg-ivory/5 border border-ivory/10">
          <p className="text-2xs text-ivory/40 uppercase tracking-widest mb-1">Signed in as</p>
          <p className="text-xs text-ivory/70 font-medium">Demo Workspace</p>
          <Badge variant="demo" className="mt-2">Sample data</Badge>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-forest mb-1">Good morning, Demo</h1>
              <p className="text-sm text-neutral-400">Rasa Foods — South India Campaign Workspace</p>
            </div>
            <Link href="/dashboard">
              <Button variant="primary" size="sm" iconRight={<ArrowRight size={14} />}>
                Create campaign
              </Button>
            </Link>
          </div>

          {/* Coming soon notice */}
          <div className="bg-brass/8 border border-brass/20 rounded-xl p-6 mb-8">
            <p className="font-semibold text-brass mb-1">Stage 1 complete — Landing page &amp; design system</p>
            <p className="text-sm text-graphite/60">
              The full dashboard, campaigns, analytics and creator features will be implemented in Stages 2–6.
              Sign in was accepted — you&apos;re now in the demo workspace.
            </p>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active campaigns", value: "2", badge: "Sample data" },
              { label: "Pending approvals", value: "1", badge: "Sample data" },
              { label: "Drafts", value: "3", badge: "Sample data" },
              { label: "Creators assigned", value: "4", badge: "Sample data" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-forest/8 shadow-editorial p-5">
                <div className="font-serif text-3xl font-semibold text-forest mb-1">{s.value}</div>
                <div className="text-xs text-neutral-500 mb-2">{s.label}</div>
                <Badge variant="demo" className="text-2xs">{s.badge}</Badge>
              </div>
            ))}
          </div>

          <div className="text-sm text-neutral-400 italic">
            Full dashboard UI coming in Stage 2. Navigate back to the{" "}
            <Link href="/" className="text-brass hover:underline">landing page</Link>.
          </div>
        </div>
      </main>
    </div>
  );
}
