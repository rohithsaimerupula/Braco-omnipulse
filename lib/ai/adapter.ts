import { z } from "zod";

/**
 * Standard structured output schema for the AI generation step (Fact Layer + Creative Layer)
 * as defined in the master prompt.
 */
export const AiGenerationSchema = z.object({
  asset_text: z.string(),
  language: z.string(),
  channel: z.string(),
  format: z.string(),
  angle: z.string(),
  adaptation_rationale: z.array(
    z.object({
      change: z.string(),
      reason: z.string(),
      confidence_note: z.string(),
    })
  ),
  claims: z.array(
    z.object({
      text_span: z.string(),
      claim_type: z.string(),
      atom_ids: z.array(z.string()),
      source_ids: z.array(z.string()),
      evidence_status: z.enum([
        "supported",
        "contradicted",
        "evidence_missing",
        "human_review",
      ]),
    })
  ),
  locked_tokens_used: z.array(
    z.object({
      atom_id: z.string(),
      token: z.string(),
    })
  ),
  review_flags: z.array(
    z.object({
      category: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      text_span: z.string(),
      explanation: z.string(),
      source_ids: z.array(z.string()),
      recommended_action: z.string(),
    })
  ),
  uncertain_local_context: z.array(z.string()),
  required_human_reviews: z.array(z.string()),
});

export type AiGenerationResult = z.infer<typeof AiGenerationSchema>;

const SARVAM_LANG_MAP: Record<string, string> = {
  telugu: "te-IN",
  tamil: "ta-IN",
  hindi: "hi-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
  marathi: "mr-IN",
  bengali: "bn-IN",
  gujarati: "gu-IN",
  punjabi: "pa-IN",
  odia: "od-IN",
  english: "en-IN",
};

function getSarvamLangCode(langName: string): string {
  const key = (langName || "english").trim().toLowerCase().split(/[\s(]/)[0];
  return SARVAM_LANG_MAP[key] || "te-IN";
}

/**
 * Live Sarvam AI Translation Adapter (`https://api.sarvam.ai/translate`)
 * Uses Sarvam Mayura v1 model for authentic Indian regional transcreation when SARVAM_API_KEY is available.
 */
export async function translateWithSarvamAI(params: {
  input: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode?: "formal" | "modern-colloquial" | "classic-colloquial";
  apiKey?: string;
}): Promise<{ translatedText: string; usedLiveSarvam: boolean; error?: string }> {
  const key = (params.apiKey || process.env.SARVAM_API_KEY || "").trim();
  if (!key) {
    return { translatedText: "", usedLiveSarvam: false, error: "No SARVAM_API_KEY configured" };
  }

  const srcCode = getSarvamLangCode(params.sourceLanguage);
  const tgtCode = getSarvamLangCode(params.targetLanguage);
  if (srcCode === tgtCode) {
    return { translatedText: params.input, usedLiveSarvam: true };
  }

  try {
    const res = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": key,
      },
      body: JSON.stringify({
        input: params.input.slice(0, 950),
        source_language_code: srcCode,
        target_language_code: tgtCode,
        speaker_gender: "Female",
        mode: params.mode || "modern-colloquial",
        model: "mayura:v1",
        enable_preprocessing: true,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        translatedText: "",
        usedLiveSarvam: false,
        error: `Sarvam API HTTP ${res.status}: ${errText.slice(0, 120)}`,
      };
    }

    const data = await res.json();
    if (data?.translated_text) {
      return {
        translatedText: String(data.translated_text).trim(),
        usedLiveSarvam: true,
      };
    }
    return {
      translatedText: "",
      usedLiveSarvam: false,
      error: "Sarvam API returned empty translated_text",
    };
  } catch (err: any) {
    return {
      translatedText: "",
      usedLiveSarvam: false,
      error: err?.message || "Sarvam network error",
    };
  }
}

/**
 * Live Google Gemini 2.0 Flash Regional Adaptation Adapter
 * Strictly enforces Sections 1-6 of the Braco Regional Language Quality Fix:
 * - Never invents unrequested festivals or guarantees
 * - Differentiates Coastal Andhra vs Telangana vs Neutral dialect
 * - Preserves brand names and locked claim qualifications
 */
export async function generateAdaptationWithGemini(params: {
  brandName?: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  region: string;
  dialect?: string;
  audience?: string;
  audienceAgeGroup?: string;
  tone: string;
  formality?: string;
  slangIntensity?: string;
  channel?: string;
  format?: string;
  culturalContext?: string;
  approvedClaims: string[];
  apiKey?: string;
}): Promise<{
  usedLiveGemini: boolean;
  literalTranslation?: string;
  naturalAdaptation?: string;
  backTranslation?: string;
  adaptationRationale?: Array<{
    change: string;
    reason: string;
    confidenceNote: string;
  }>;
  culturalNotes?: string[];
  error?: string;
}> {
  const key = (params.apiKey || process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    return { usedLiveGemini: false, error: "No GEMINI_API_KEY configured" };
  }

  const systemPrompt = `You are the Braco OmniPulse Regional Language Quality Engine.
STRICT GOVERNANCE RULES:
1. Preserve the original campaign's objective, factual meaning, qualifications (e.g., "with regular use", "when consumed with milk"), and approved claims.
2. Target Language: ${params.targetLanguage} | Target Region: ${params.region} | Dialect: ${params.dialect || "Neutral Standard (do not assume a specific sub-dialect)"}.
3. Tone: ${params.tone} | Formality: ${params.formality || "Conversational Respectful"} | Slang Intensity: ${params.slangIntensity || "none"}.
4. Channel: ${params.channel || "Social Media"} | Format: ${params.format || "Short Video Caption"}.
5. Cultural Context Supplied: ${params.culturalContext ? `"${params.culturalContext}"` : "NONE — DO NOT invent or insert any festival (no Sankranti, Ugadi, Diwali, etc.)."}
6. NEVER invent guarantees ("100% guaranteed", "గ్యారెంటీ"), medical cures, family-health claims, or discounts not in the source text.
7. Preserve the brand name "${params.brandName || ""}" accurately.
8. Return ONLY valid JSON with keys:
{
  "literalTranslation": "string (word-for-word faithful translation in target script)",
  "naturalAdaptation": "string (idiomatic, conversational regional copy in target script respecting dialect and rules)",
  "backTranslation": "string (accurate English back-translation of naturalAdaptation for reviewer assistance)",
  "adaptationRationale": [{"change": "string", "reason": "string", "confidenceNote": "string"}],
  "culturalNotes": ["string"]
}`;

  const userPrompt = `Source Copy (${params.sourceLanguage}):
"${params.sourceText}"

Approved Claims to Preserve:
${params.approvedClaims.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        usedLiveGemini: false,
        error: `Gemini API HTTP ${res.status}: ${errText.slice(0, 120)}`,
      };
    }

    const data = await res.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!rawText) {
      return { usedLiveGemini: false, error: "Empty response from Gemini API" };
    }

    const parsed = JSON.parse(rawText);
    if (parsed.naturalAdaptation && parsed.literalTranslation) {
      return {
        usedLiveGemini: true,
        literalTranslation: String(parsed.literalTranslation),
        naturalAdaptation: String(parsed.naturalAdaptation),
        backTranslation: String(parsed.backTranslation || ""),
        adaptationRationale: Array.isArray(parsed.adaptationRationale)
          ? parsed.adaptationRationale
          : [],
        culturalNotes: Array.isArray(parsed.culturalNotes)
          ? parsed.culturalNotes
          : [],
      };
    }
    return { usedLiveGemini: false, error: "Invalid JSON schema from Gemini" };
  } catch (err: any) {
    return {
      usedLiveGemini: false,
      error: err?.message || "Gemini API request failed",
    };
  }
}

/**
 * Legacy helper preserved for backwards compatibility with existing callers.
 */
export async function generateCampaignVariant(
  prompt: string,
  geminiApiKey?: string
): Promise<{
  data: AiGenerationResult;
  generated_by_mode: "live" | "demo_fixture";
}> {
  const key = (geminiApiKey || process.env.GEMINI_API_KEY || "").trim();
  if (key) {
    const live = await generateAdaptationWithGemini({
      sourceText: prompt,
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh",
      dialect: "Coastal Andhra",
      tone: "Clear, Warm, Conversational",
      approvedClaims: [prompt],
      apiKey: key,
    });
    if (live.usedLiveGemini && live.naturalAdaptation) {
      return {
        generated_by_mode: "live",
        data: {
          asset_text: live.naturalAdaptation,
          language: "Telugu",
          channel: "Social Media",
          format: "Short Video Caption",
          angle: "Regional Adaptation via Gemini 2.0 Flash",
          adaptation_rationale: (live.adaptationRationale || []).map((r) => ({
            change: r.change,
            reason: r.reason,
            confidence_note: r.confidenceNote,
          })),
          claims: [],
          locked_tokens_used: [],
          review_flags: [],
          uncertain_local_context: [],
          required_human_reviews: [],
        },
      };
    }
  }

  return {
    generated_by_mode: "demo_fixture",
    data: {
      asset_text:
        "గ్రీన్‌గ్లో (GreenGlow) అలోవెరా జెల్ — 95% స్వచ్ఛమైన అలోవెరా ఆకు సారంతో తయారైంది. క్రమం తప్పకుండా వాడితే మీ చర్మానికి చక్కని తేమను అందించడంలో సహాయపడుతుంది.",
      language: "Telugu",
      channel: "Social Media",
      format: "Short Video Caption",
      angle: "Everyday Skincare Hydration",
      adaptation_rationale: [
        {
          change:
            "Adapted 'helps keep skin hydrated with regular use' into natural Coastal Andhra Telugu",
          reason:
            "Avoided robotic literal syntax while preserving the 'with regular use' qualification.",
          confidence_note: "Verified by deterministic Regional Engine.",
        },
      ],
      claims: [
        {
          text_span: "క్రమం తప్పకుండా వాడితే చర్మానికి చక్కని తేమను అందించడంలో సహాయపడుతుంది",
          claim_type: "Cosmetic Hydration Support",
          atom_ids: ["claim-gg-1"],
          source_ids: ["GG-2026-01"],
          evidence_status: "supported",
        },
      ],
      locked_tokens_used: [
        {
          atom_id: "claim-gg-1",
          token: "with regular use",
        },
      ],
      review_flags: [],
      uncertain_local_context: [],
      required_human_reviews: [],
    },
  };
}
