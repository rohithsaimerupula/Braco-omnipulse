import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Globe2,
  LayoutDashboard,
  Library,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Users,
  FileCheck2,
} from "lucide-react";
import { getAuthenticatedUser, signOut } from "@/app/auth/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthenticatedUser();
  const user = authUser || {
    name: "Braco Evaluator",
    email: "evaluator@braco.ai",
    role: "Regional Reviewer & Compliance Lead",
  };

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
          {
            icon: <LayoutDashboard size={15} />,
            label: "Sections 1–8 Hub",
            href: "/dashboard",
          },
          {
            icon: <FileText size={15} />,
            label: "New Campaign (11-Field)",
            href: "/campaigns/new",
          },
          {
            icon: <Globe2 size={15} />,
            label: "A–H Translation Studio",
            href: "/campaigns/greenglow-small-daily-choices-greener-living/studio",
          },
          {
            icon: <CheckSquare size={15} />,
            label: "Brand Guardian (7-Pass)",
            href: "/campaigns/greenglow-small-daily-choices-greener-living/guardian",
          },
          {
            icon: <Library size={15} />,
            label: "Brand Library",
            href: "/dashboard/library",
          },
          {
            icon: <CheckSquare size={15} />,
            label: "Approvals & RBAC",
            href: "/approvals/greenglow-small-daily-choices-greener-living",
          },
          {
            icon: <Users size={15} />,
            label: "Creator Match",
            href: "/campaigns/greenglow-small-daily-choices-greener-living/creators",
          },
          {
            icon: <BarChart3 size={15} />,
            label: "A/B & Analytics",
            href: "/campaigns/greenglow-small-daily-choices-greener-living/experiment",
          },
          {
            icon: <FileCheck2 size={15} />,
            label: "Decision Passport",
            href: "/campaigns/greenglow-small-daily-choices-greener-living/passport",
          },
          {
            icon: <Settings size={15} />,
            label: "Settings & AI Keys",
            href: "/dashboard/settings",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-ivory/75 hover:text-ivory hover:bg-ivory/10"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className="mt-auto space-y-2">
          <div className="px-3 py-3 rounded-lg bg-ivory/5 border border-ivory/10">
            <p className="text-2xs text-ivory/40 uppercase tracking-widest mb-1">
              Signed in as
            </p>
            {user.name && (
              <p className="text-xs text-ivory font-semibold truncate">
                {user.name}
              </p>
            )}
            <p className="text-2xs text-ivory/70 font-mono truncate">
              {user.email}
            </p>
            {user.role && (
              <p className="text-2xs text-brass font-medium truncate mt-1">
                {user.role}
              </p>
            )}
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ivory/70 hover:text-ivory hover:bg-red-500/20 border border-ivory/10 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
