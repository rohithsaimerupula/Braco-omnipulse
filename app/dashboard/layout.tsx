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
} from "lucide-react";
import { getAuthenticatedUser, signOut } from "@/app/auth/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(
      "/sign-in?error=Please+sign+in+with+your+registered+email+to+access+the+dashboard."
    );
  }

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
            label: "Overview",
            href: "/dashboard",
          },
          {
            icon: <Library size={15} />,
            label: "Brand Library",
            href: "/dashboard/library",
          },
          {
            icon: <FileText size={15} />,
            label: "Campaigns",
            href: "/campaigns/new",
          },
          {
            icon: <CheckSquare size={15} />,
            label: "Approvals",
            href: "/approvals/south-india-diwali",
          },
          {
            icon: <BarChart3 size={15} />,
            label: "Analytics",
            href: "/campaigns/south-india-diwali/experiment",
          },
          {
            icon: <Settings size={15} />,
            label: "Decision Passport",
            href: "/campaigns/south-india-diwali/passport",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-ivory/60 hover:text-ivory hover:bg-ivory/10"
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
