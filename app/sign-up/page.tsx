import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { signup } from "@/app/auth/actions";

export const metadata = {
  title: "Sign up — Braco OmniPulse",
  description: "Create your Braco OmniPulse account and explore regional campaign intelligence.",
};

const accountTypes = [
  { id: "individual", label: "Individual customer", desc: "Personal campaigns and brand projects" },
  { id: "brand", label: "Brand or business", desc: "Multi-campaign brand management" },
  { id: "agency", label: "Marketing agency", desc: "Client campaign workspace" },
  { id: "creator", label: "Creator or influencer", desc: "Accept briefs and manage collaborations" },
];

export default function SignUpPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory flex items-center justify-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="w-8 h-8 rounded-md bg-forest flex items-center justify-center">
              <Globe2 size={16} className="text-brass" />
            </span>
            <span className="font-serif font-semibold text-forest text-xl">
              Braco <span className="text-brass">OmniPulse</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-forest/8 shadow-editorial p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif text-2xl font-semibold text-forest">Create account</h1>
                <p className="text-sm text-neutral-400 mt-0.5">Stage 2 implements full auth</p>
              </div>
              <Badge variant="demo">Demo mode</Badge>
            </div>

            {searchParams?.error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                {searchParams.error}
              </div>
            )}

            <form className="space-y-4" action={signup}>
              <div>
                <label htmlFor="signup-name" className="block text-xs font-medium text-graphite mb-1.5">Full name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full h-10 px-3.5 rounded-md border border-forest/15 bg-ivory text-sm text-graphite
                             placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-xs font-medium text-graphite mb-1.5">Email</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-10 px-3.5 rounded-md border border-forest/15 bg-ivory text-sm text-graphite
                             placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite mb-2">Account type</label>
                <div className="grid grid-cols-2 gap-2">
                  {accountTypes.map((t) => (
                    <label
                      key={t.id}
                      htmlFor={`type-${t.id}`}
                      className="flex flex-col gap-0.5 p-3 rounded-lg border border-forest/10 cursor-pointer hover:border-brass/40 hover:bg-sage/20 transition-all has-[:checked]:border-brass/50 has-[:checked]:bg-brass/5"
                    >
                      <input
                        id={`type-${t.id}`}
                        type="radio"
                        name="account-type"
                        value={t.id}
                        className="sr-only"
                      />
                      <span className="text-xs font-semibold text-forest">{t.label}</span>
                      <span className="text-2xs text-neutral-400">{t.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-xs font-medium text-graphite mb-1.5">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-10 px-3.5 rounded-md border border-forest/15 bg-ivory text-sm text-graphite
                             placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
                />
              </div>
              <Button type="submit" variant="primary" size="md" fullWidth iconRight={<ArrowRight size={15} />}>
                Create account
              </Button>
            </form>

            <p className="text-center text-xs text-neutral-400 mt-5">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-brass hover:text-brass-500 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
