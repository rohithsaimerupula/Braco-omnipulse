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
  adaptation_rationale: z.array(z.object({
    change: z.string(),
    reason: z.string(),
    confidence_note: z.string()
  })),
  claims: z.array(z.object({
    text_span: z.string(),
    claim_type: z.string(),
    atom_ids: z.array(z.string()),
    source_ids: z.array(z.string()),
    evidence_status: z.enum(["supported", "contradicted", "evidence_missing", "human_review"])
  })),
  locked_tokens_used: z.array(z.object({
    atom_id: z.string(),
    token: z.string()
  })),
  review_flags: z.array(z.object({
    category: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    text_span: z.string(),
    explanation: z.string(),
    source_ids: z.array(z.string()),
    recommended_action: z.string()
  })),
  uncertain_local_context: z.array(z.string()),
  required_human_reviews: z.array(z.string())
});

export type AiGenerationResult = z.infer<typeof AiGenerationSchema>;

/**
 * AI Adapter: Generates campaign variants.
 * Falls back to a deterministic "Demo fixture" if no API key is provided,
 * satisfying the hackathon MVP requirements.
 */
export async function generateCampaignVariant(prompt: string): Promise<{ data: AiGenerationResult, generated_by_mode: 'live' | 'demo_fixture' }> {
  // If an API key is present, we would call the Vercel AI SDK here.
  // if (process.env.OPENAI_API_KEY) {
  //   const { object } = await generateObject({ ... });
  //   return { data: object, generated_by_mode: 'live' };
  // }

  // DEMO FIXTURE FALLBACK
  return {
    generated_by_mode: 'demo_fixture',
    data: {
      asset_text: "రుచికరమైన బ్రాకో ఓట్స్, ప్రతి ఉదయం మీ ఆరోగ్యానికి మంచిది.",
      language: "Telugu",
      channel: "Social Media",
      format: "Short Video Caption",
      angle: "Health and Morning Routine",
      adaptation_rationale: [
        {
          change: "Translated 'Delicious' to 'రుచికరమైన'",
          reason: "Common natural phrasing in Telugu advertising.",
          confidence_note: "High confidence."
        }
      ],
      claims: [
        {
          text_span: "ఆరోగ్యానికి మంచిది",
          claim_type: "Health Benefit",
          atom_ids: ["atom-123"],
          source_ids: ["src-456"],
          evidence_status: "supported"
        }
      ],
      locked_tokens_used: [
        {
          atom_id: "atom-123",
          token: "every morning"
        }
      ],
      review_flags: [
        {
          category: "Compliance",
          severity: "low",
          text_span: "ప్రతి ఉదయం",
          explanation: "Ensure the claim 'every morning' aligns with approved dietary guidelines.",
          source_ids: ["src-456"],
          recommended_action: "Reviewer to confirm."
        }
      ],
      uncertain_local_context: [],
      required_human_reviews: []
    }
  };
}
