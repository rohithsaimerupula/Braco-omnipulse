"use server";

import { turso } from "@/lib/turso";
import { Campaign, GuardianFinding, ClaimAtom } from "@/lib/campaigns/types";
import {
  generateRegionalAdaptation,
  verifyCompleteCopyWithGuardian,
  translateWithFallback,
} from "@/lib/regional/engine";

/**
 * Ensure Turso libSQL tables exist for Campaigns, Brand Library, and Audit Logs
 */
export async function ensureDomainTables() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS campaigns_store (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS brand_library_items (
      id TEXT PRIMARY KEY,
      item_type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tokens TEXT,
      source TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

export async function translateTextRealTime(
  text: string,
  targetLangName: string,
  sourceLangName = "English"
): Promise<string> {
  return translateWithFallback(text, sourceLangName, targetLangName);
}

/**
 * Real-Time Dual Adaptation Engine (Sections 1-6):
 * Delegates to lib/regional/engine.ts so it strictly respects cultural-context controls,
 * dialect differentiation, back-translation, and honest evaluation statuses.
 */
export async function runRealTimeAdaptationServer(params: {
  brandName?: string;
  sourceText: string;
  sourceLanguage?: string;
  targetLanguage: string;
  region: string;
  dialect?: string;
  audience?: string;
  audienceAgeGroup?: string;
  tone: string;
  formality?: string;
  slangIntensity?: string;
  slangFormality: string;
  channel?: string;
  format?: string;
  culturalContext: string;
  claimAtoms: ClaimAtom[];
}) {
  return generateRegionalAdaptation({
    brandName: params.brandName,
    sourceText: params.sourceText,
    sourceLanguage: params.sourceLanguage || "English",
    targetLanguage: params.targetLanguage,
    region: params.region,
    dialect: params.dialect,
    audience: params.audience,
    audienceAgeGroup: params.audienceAgeGroup,
    tone: params.tone,
    formality: params.formality || params.slangFormality,
    slangIntensity: params.slangIntensity || "none",
    channel: params.channel || "Social Media",
    format: params.format || "Short Video Caption",
    culturalContext: params.culturalContext,
    claimAtoms: params.claimAtoms,
  });
}

/**
 * Real-Time Brand Guardian Full-Copy Verification Engine (Section 4):
 * Runs checks on the complete generated copy against source brief, cultural context, and claim atoms.
 */
export async function runRealTimeGuardianServer(params: {
  brandName?: string;
  sourceText?: string;
  naturalAdaptation: string;
  literalTranslation: string;
  sourceLanguage?: string;
  targetLanguage: string;
  region: string;
  dialect?: string;
  culturalContext?: string;
  format?: string;
  claimAtoms: ClaimAtom[];
}): Promise<{
  findings: GuardianFinding[];
  hasBlockingIssues: boolean;
  honestStatus: string;
  evaluationMethodNote: string;
  claimDiffs: any[];
  meaningPreservationFindings: string[];
  languageDialectWarnings: string[];
  documentedScore: number;
}> {
  return verifyCompleteCopyWithGuardian({
    brandName: params.brandName,
    sourceText: params.sourceText || "",
    literalTranslation: params.literalTranslation,
    naturalAdaptation: params.naturalAdaptation,
    sourceLanguage: params.sourceLanguage || "English",
    targetLanguage: params.targetLanguage,
    region: params.region,
    dialect: params.dialect,
    culturalContext: params.culturalContext || "",
    format: params.format,
    claimAtoms: params.claimAtoms,
  });
}

/**
 * Sync campaign to Turso libSQL database in real time
 */
export async function syncCampaignToTurso(campaign: Campaign) {
  try {
    await ensureDomainTables();
    await turso.execute({
      sql: `INSERT INTO campaigns_store (id, name, payload, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              payload = excluded.payload,
              updated_at = excluded.updated_at`,
      args: [
        campaign.id,
        campaign.name,
        JSON.stringify(campaign),
        Date.now(),
      ],
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to sync campaign to Turso:", err);
    return { success: false };
  }
}

/**
 * Fetch all campaigns from Turso libSQL database
 */
export async function fetchCampaignsFromTurso(): Promise<Campaign[]> {
  try {
    await ensureDomainTables();
    const res = await turso.execute(
      "SELECT payload FROM campaigns_store ORDER BY updated_at DESC"
    );
    return res.rows
      .map((r) => {
        try {
          return JSON.parse(r.payload as string) as Campaign;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Campaign[];
  } catch (err) {
    console.error("Failed to fetch campaigns from Turso:", err);
    return [];
  }
}

/**
 * Brand Knowledge Library Real-Time CRUD in Turso libSQL
 */
export async function getBrandLibraryItems() {
  try {
    await ensureDomainTables();
    const res = await turso.execute(
      "SELECT * FROM brand_library_items ORDER BY created_at DESC"
    );

    if (res.rows.length === 0) {
      const seedClaims = [
        {
          id: "atom-greenglow-1",
          item_type: "claim",
          title: "GreenGlow Aloe Hydration Claim",
          content:
            "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
          tokens: JSON.stringify(["GreenGlow", "with regular use", "hydrated"]),
          source: "Dermatological Evaluation Dossier GG-2026-01",
          created_at: new Date().toISOString(),
        },
        {
          id: "atom-greenglow-2",
          item_type: "fact",
          title: "GreenGlow 95% Pure Aloe Extract",
          content: "Made with 95% pure aloe vera leaf extract.",
          tokens: JSON.stringify(["95%", "pure aloe vera leaf extract"]),
          source: "Formulation Lab Certificate GG-LAB-09",
          created_at: new Date().toISOString(),
        },
        {
          id: "atom-101",
          item_type: "claim",
          title: "Daily Iron Bioavailability Claim",
          content:
            "Rasa Oats provides 100% of your daily iron needs when consumed with milk.",
          tokens: JSON.stringify(["100%", "daily iron needs", "with milk"]),
          source: "Clinical Trial Dossier CT-2024-09",
          created_at: new Date().toISOString(),
        },
        {
          id: "rule-201",
          item_type: "rule",
          title: "No health guarantees (ASCI 1.4)",
          content:
            "Never use 'guaranteed results', '100% cure', or 'గ్యారెంటీ' in regional adaptations without clinical trial backing.",
          tokens: JSON.stringify(["guaranteed", "cure", "గ్యారెంటీ"]),
          source: "ASCI Chapter 1.4 Compliance",
          created_at: new Date().toISOString(),
        },
        {
          id: "rule-202",
          item_type: "rule",
          title: "Cultural-Context Control (No Unrequested Festivals)",
          content:
            "Use only the cultural context supplied in the campaign brief. If a festive moment is not specified, do not add a festival.",
          tokens: JSON.stringify(["no-invented-festivals", "dialect-neutrality"]),
          source: "Braco Regional Language Quality Standard v2",
          created_at: new Date().toISOString(),
        },
      ];

      for (const item of seedClaims) {
        await turso.execute({
          sql: `INSERT OR IGNORE INTO brand_library_items (id, item_type, title, content, tokens, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            item.id,
            item.item_type,
            item.title,
            item.content,
            item.tokens,
            item.source,
            item.created_at,
          ],
        });
      }

      return seedClaims.map((s) => ({
        ...s,
        tokens: JSON.parse(s.tokens),
      }));
    }

    return res.rows.map((r) => ({
      id: r.id as string,
      item_type: r.item_type as string,
      title: r.title as string,
      content: r.content as string,
      tokens: r.tokens ? JSON.parse(r.tokens as string) : [],
      source: (r.source as string) || "Brand Library",
      created_at: r.created_at as string,
    }));
  } catch (err) {
    console.error("Failed to load Brand Library from Turso:", err);
    return [];
  }
}

export async function addBrandLibraryItem(input: {
  item_type: "claim" | "fact" | "rule";
  title: string;
  content: string;
  tokens: string[];
  source: string;
}) {
  await ensureDomainTables();
  const id = `${input.item_type}-${Date.now().toString().slice(-4)}`;
  const created_at = new Date().toISOString();

  await turso.execute({
    sql: `INSERT INTO brand_library_items (id, item_type, title, content, tokens, source, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.item_type,
      input.title,
      input.content,
      JSON.stringify(input.tokens),
      input.source,
      created_at,
    ],
  });

  return {
    id,
    ...input,
    created_at,
  };
}
