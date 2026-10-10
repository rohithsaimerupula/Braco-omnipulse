import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Globe2 } from "lucide-react";
import { login } from "@/app/auth/actions";

export const metadata = {
  title: "Sign in — Braco OmniPulse",
  description: "Sign in to your Braco OmniPulse workspace.",
};

export default function SignInPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-sm">
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
            <h1 className="font-serif text-2xl font-semibold text-forest mb-1 text-center">Welcome back</h1>
            <p className="text-sm text-neutral-500 text-center mb-7">Sign in to your workspace</p>



            {searchParams?.error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                {searchParams.error}
              </div>
            )}

            <form className="space-y-4" action={login}>
              <div>
                <label htmlFor="signin-email" className="block text-xs font-medium text-graphite mb-1.5">
                  Email
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue="admin@bracoomnipulse.com"
                  className="w-full h-10 px-3.5 rounded-md border border-forest/15 bg-ivory text-sm text-graphite
                             placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brass/40 focus:border-brass/40
                             transition-all duration-150"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-xs font-medium text-graphite mb-1.5">
                  Password
                </label>
                <input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="demo1234"
                  className="w-full h-10 px-3.5 rounded-md border border-forest/15 bg-ivory text-sm text-graphite
                             placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brass/40 focus:border-brass/40
                             transition-all duration-150"
                />
              </div>
              <Button type="submit" variant="primary" size="md" fullWidth iconRight={<ArrowRight size={15} />}>
                Sign in
              </Button>
            </form>

            <p className="text-center text-xs text-neutral-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-brass hover:text-brass-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
