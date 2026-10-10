import Link from "next/link";
import { Globe2, LayoutDashboard, Library, FileText, CheckSquare, BarChart3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user and no Supabase URL, we're in Demo mode bypass.
  // We'll show a demo user info.
  const email = user?.email || "demo@bracoomnipulse.com";

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
          { icon: <LayoutDashboard size={15} />, label: "Overview", href: "/dashboard" },
          { icon: <Library size={15} />, label: "Brand Library", href: "/dashboard/library" },
          { icon: <FileText size={15} />, label: "Campaigns", href: "/campaigns" },
          { icon: <CheckSquare size={15} />, label: "Approvals", href: "/approvals" },
          { icon: <BarChart3 size={15} />, label: "Analytics", href: "/dashboard/analytics" },
          { icon: <Settings size={15} />, label: "Settings", href: "/dashboard/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-ivory/50 hover:text-ivory hover:bg-ivory/5`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="mt-auto px-2 py-3 rounded-lg bg-ivory/5 border border-ivory/10">
          <p className="text-2xs text-ivory/40 uppercase tracking-widest mb-1">Signed in as</p>
          <p className="text-xs text-ivory/70 font-medium truncate">{email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
