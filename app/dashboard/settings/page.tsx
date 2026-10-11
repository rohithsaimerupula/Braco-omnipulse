"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  ShieldCheck,
  KeyRound,
  Users,
  Sparkles,
  CheckCircle2,
  Database,
  Radio,
  RefreshCw,
} from "lucide-react";
import {
  getAuthenticatedUser,
  updateUserRoleAction,
  getAllWorkspaceUsersAction,
} from "@/app/auth/actions";
import {
  getWorkspaceSettingsServer,
  saveWorkspaceSettingsServer,
  testAiProviderConnectionServer,
} from "@/app/actions/campaignActions";

const AVAILABLE_ROLES = [
  {
    id: "Principal Brand & Legal Approver",
    description:
      "Full compliance sign-off authority in Stage 3 Review Center and Decision Passport minting.",
  },
  {
    id: "Regional Linguistic Reviewer",
    description:
      "Reviews dialect accuracy (Coastal Andhra, Telangana, Tamil, etc.) and approves regional adaptations.",
  },
  {
    id: "Author & Strategist",
    description:
      "Creates campaign briefs and edits studio drafts. Cannot self-approve own campaigns when strict RBAC separation is enabled.",
  },
  {
    id: "Workspace Admin (Full Override)",
    description:
      "Can author, edit, and approve any campaign version across the workspace.",
  },
];

export default function WorkspaceSettingsPage() {
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    company: string;
    role: string;
  } | null>(null);
  const [workspaceUsers, setWorkspaceUsers] = useState<
    Array<{ email: string; name: string; company: string; role: string }>
  >([]);

  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [sarvamApiKey, setSarvamApiKey] = useState("");
  const [hasEnvGemini, setHasEnvGemini] = useState(false);
  const [hasEnvSarvam, setHasEnvSarvam] = useState(false);
  const [preferredProvider, setPreferredProvider] = useState<
    "auto" | "gemini" | "sarvam" | "mymemory"
  >("auto");
  const [strictRbac, setStrictRbac] = useState(true);
  const [adPlatformConnected, setAdPlatformConnected] = useState(true);
  const [metaAdAccountId, setMetaAdAccountId] = useState(
    "act_84920144920_BRACO_IN"
  );
  const [googleAdsCustomerId, setGoogleAdsCustomerId] =
    useState("742-910-4821");

  const [savingSettings, setSavingSettings] = useState(false);
  const [savedToast, setSavedToast] = useState("");

  // Live Provider Tester state
  const [testingProvider, setTestingProvider] = useState(false);
  const [testResult, setTestResult] = useState<{
    latencyMs: number;
    activeProviderUsed: string;
    geminiStatus: string;
    sarvamStatus: string;
    sampleOutput: string;
  } | null>(null);

  const loadAll = async () => {
    const [u, allUsers, ws] = await Promise.all([
      getAuthenticatedUser(),
      getAllWorkspaceUsersAction(),
      getWorkspaceSettingsServer(),
    ]);
    if (u) setCurrentUser(u);
    setWorkspaceUsers(allUsers);
    setGeminiApiKey(ws.geminiApiKey || "");
    setSarvamApiKey(ws.sarvamApiKey || "");
    setHasEnvGemini(ws.hasEnvGeminiKey);
    setHasEnvSarvam(ws.hasEnvSarvamKey);
    setPreferredProvider(ws.preferredAiProvider || "auto");
    setStrictRbac(ws.strictAuthorReviewerSeparation ?? true);
    setAdPlatformConnected(ws.adPlatformConnected ?? true);
    setMetaAdAccountId(ws.metaAdAccountId || "act_84920144920_BRACO_IN");
    setGoogleAdsCustomerId(ws.googleAdsCustomerId || "742-910-4821");
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRoleChange = async (email: string, newRole: string) => {
    await updateUserRoleAction(email, newRole);
    setSavedToast(`Updated role for ${email} to "${newRole}"`);
    setTimeout(() => setSavedToast(""), 3500);
    await loadAll();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    await saveWorkspaceSettingsServer({
      geminiApiKey,
      sarvamApiKey,
      preferredAiProvider: preferredProvider,
      strictAuthorReviewerSeparation: strictRbac,
      adPlatformConnected,
      metaAdAccountId,
      googleAdsCustomerId,
    });
    setSavingSettings(false);
    setSavedToast(
      "Workspace settings & AI provider keys saved to Turso libSQL!"
    );
    setTimeout(() => setSavedToast(""), 3500);
    await loadAll();
  };

  const handleTestProviders = async () => {
    setTestingProvider(true);
    const res = await testAiProviderConnectionServer({
      sampleText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      targetLanguage: "Telugu",
      dialect: "Coastal Andhra",
    });
    setTestResult(res);
    setTestingProvider(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-forest" />
            <h1 className="font-serif text-2xl font-semibold text-forest">
              Workspace Governance, RBAC & Live AI Settings
            </h1>
          </div>
          <p className="text-xs text-muted mt-1">
            Configure Role-Based Access Control (Author vs. Approver), Google
            Gemini & Sarvam AI keys, and Ad Platform Telemetry in Turso libSQL.
          </p>
        </div>
        <Badge variant="sage">
          <Database size={11} className="mr-1" /> Turso Cloud Synced
        </Badge>
      </div>

      {savedToast && (
        <div className="p-4 rounded-xl bg-sage-light border border-sage/30 flex items-center gap-2.5 text-xs font-medium text-forest">
          <CheckCircle2 size={16} className="text-sage shrink-0" />
          {savedToast}
        </div>
      )}

      {/* Section 1: RBAC & Active User Governance Role */}
      <div className="bg-white rounded-2xl border border-forest/15 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-forest" />
            <h2 className="font-serif text-base font-semibold text-forest">
              1. Role-Based Access Control (RBAC — Author vs. Approver
              Governance)
            </h2>
          </div>
          {currentUser && (
            <Badge variant="sage">Active Role: {currentUser.role}</Badge>
          )}
        </div>

        <p className="text-xs text-muted">
          Select your active governance role below. When{" "}
          <strong>Strict Author vs. Reviewer Separation</strong> is enabled and
          your role is set to <em>Author & Strategist</em>, the Review Center (
          <code>/approvals/[id]</code>) will block self-approval of campaigns
          you authored until a Reviewer or Approver signs off.
        </p>

        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_ROLES.map((r) => {
              const isSelected = currentUser.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(currentUser.email, r.id)}
                  className={`text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? "bg-forest text-ivory border-forest shadow-sm"
                      : "bg-ivory/50 text-forest border-forest/15 hover:border-forest/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{r.id}</span>
                    {isSelected && (
                      <span className="text-2xs px-2 py-0.5 rounded bg-brass text-forest font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-2xs ${
                      isSelected ? "text-ivory/80" : "text-muted"
                    }`}
                  >
                    {r.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-forest/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-forest block">
              Enforce Strict Author vs. Approver Separation
            </span>
            <span className="text-2xs text-muted">
              Prevents users with the &ldquo;Author & Strategist&rdquo; role
              from approving versions in Stage 3 without switching to a Reviewer
              / Approver role.
            </span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={strictRbac}
              onChange={(e) => setStrictRbac(e.target.checked)}
              className="w-4 h-4 accent-forest"
            />
            <span className="text-xs font-medium text-forest">
              {strictRbac ? "Enforced" : "Disabled"}
            </span>
          </label>
        </div>

        {/* Registered Workspace Users Table */}
        {workspaceUsers.length > 0 && (
          <div className="pt-4 border-t border-forest/10">
            <h3 className="text-xs font-semibold text-forest uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users size={13} /> Registered Workspace Accounts (
              {workspaceUsers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-forest/10 text-muted text-2xs uppercase">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Company</th>
                    <th className="py-2">Assigned Governance Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {workspaceUsers.map((u) => (
                    <tr key={u.email}>
                      <td className="py-2.5 pr-4 font-medium text-forest">
                        {u.name}
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-2xs text-muted">
                        {u.email}
                      </td>
                      <td className="py-2.5 pr-4 text-muted">
                        {u.company || "Braco"}
                      </td>
                      <td className="py-2.5">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.email, e.target.value)
                          }
                          className="px-2.5 py-1 rounded-lg border border-forest/15 bg-ivory/60 text-xs text-forest"
                        >
                          {AVAILABLE_ROLES.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.id}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Live LLM & Regional Translation API Keys */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white rounded-2xl border border-forest/15 p-6 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-brass" />
            <h2 className="font-serif text-base font-semibold text-forest">
              2. Live LLM Provider Integration (Google Gemini & Sarvam AI)
            </h2>
          </div>
          <Badge variant="neutral">
            Zero-Key Fallback Active (MyMemory + Regional Engine)
          </Badge>
        </div>

        <p className="text-xs text-muted">
          Braco OmniPulse works out-of-the-box with zero API keys using our
          deterministic Regional Quality Engine + MyMemory Neural API. Optionally
          provide your <strong>Google Gemini API Key</strong> or{" "}
          <strong>Sarvam AI Subscription Key</strong> below to enable live LLM
          transcreation while still running every output through the
          Complete-Copy Brand Guardian.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-forest block mb-1">
              Google Gemini API Key (<code>GEMINI_API_KEY</code>)
              {hasEnvGemini && (
                <span className="ml-2 text-2xs text-sage font-normal">
                  (Detected in .env)
                </span>
              )}
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy... (Optional — leave blank for automatic fallback)"
              className="w-full px-3 py-2 rounded-lg border border-forest/15 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-forest block mb-1">
              Sarvam AI API Key (<code>SARVAM_API_KEY</code>)
              {hasEnvSarvam && (
                <span className="ml-2 text-2xs text-sage font-normal">
                  (Detected in .env)
                </span>
              )}
            </label>
            <input
              type="password"
              value={sarvamApiKey}
              onChange={(e) => setSarvamApiKey(e.target.value)}
              placeholder="sarvam_... (Optional — leave blank for automatic fallback)"
              className="w-full px-3 py-2 rounded-lg border border-forest/15 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-forest block mb-1">
              Preferred Adaptation Provider
            </label>
            <select
              value={preferredProvider}
              onChange={(e) => setPreferredProvider(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-forest/15 text-xs bg-white"
            >
              <option value="auto">
                Auto (Gemini / Sarvam if set → Regional Engine Fallback)
              </option>
              <option value="gemini">
                Google Gemini 2.0 Flash + Brand Guardian
              </option>
              <option value="sarvam">
                Sarvam AI Mayura v1 + Brand Guardian
              </option>
              <option value="mymemory">
                Deterministic Regional Engine + MyMemory Neural API
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-forest block mb-1">
              Connected Meta Ads Account ID
            </label>
            <input
              type="text"
              value={metaAdAccountId}
              onChange={(e) => setMetaAdAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-forest/15 text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-forest block mb-1">
              Connected Google Ads Customer ID
            </label>
            <input
              type="text"
              value={googleAdsCustomerId}
              onChange={(e) => setGoogleAdsCustomerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-forest/15 text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-forest/10">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleTestProviders}
            disabled={testingProvider}
          >
            {testingProvider ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Testing Live
                Pipeline...
              </>
            ) : (
              <>
                <Sparkles size={13} /> Test Live Adaptation Pipeline
              </>
            )}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={savingSettings}
          >
            {savingSettings
              ? "Saving to Turso..."
              : "Save Workspace Settings"}
          </Button>
        </div>

        {testResult && (
          <div className="p-4 rounded-xl bg-ivory border border-forest/15 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-forest flex items-center gap-1.5">
                <Radio size={13} className="text-sage" /> Active Pipeline:{" "}
                {testResult.activeProviderUsed}
              </span>
              <Badge variant="sage">Latency: {testResult.latencyMs} ms</Badge>
            </div>
            <p className="text-2xs text-muted">
              • Gemini Status: <strong>{testResult.geminiStatus}</strong> |
              Sarvam Status: <strong>{testResult.sarvamStatus}</strong>
            </p>
            <div className="p-3 rounded-lg bg-white border border-forest/10">
              <span className="text-2xs text-muted block mb-1">
                Sample Coastal Andhra Telugu Output (GreenGlow Test):
              </span>
              <p className="text-sm font-medium text-forest">
                {testResult.sampleOutput}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
