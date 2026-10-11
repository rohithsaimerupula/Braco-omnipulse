import assert from "node:assert/strict";
import {
  generateRegionalAdaptation,
  verifyCompleteCopyWithGuardian,
} from "../lib/regional/engine";
import { ClaimAtom } from "../lib/campaigns/types";

const GREENGLOW_CLAIMS: ClaimAtom[] = [
  {
    id: "claim-gg-1",
    canonicalText:
      "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
    lockedTokens: ["GreenGlow", "with regular use", "hydrated"],
    requiredQualifications: ["with regular use"],
    sourceTitle: "Dermatological Evaluation Dossier GG-2026-01",
    evidenceStatus: "supported",
  },
  {
    id: "claim-gg-2",
    canonicalText: "Made with 95% pure aloe vera leaf extract.",
    lockedTokens: ["95%", "pure aloe vera leaf extract"],
    sourceTitle: "Formulation Lab Certificate GG-LAB-09",
    evidenceStatus: "supported",
  },
];

async function runTests() {
  let passed = 0;

  // =========================================================================
  // 0. ACCEPTANCE CRITERION: GreenGlow Test Case
  // Must NOT add a festival reference, a family-health implication, or
  // 'results guaranteed' unless explicitly requested in the brief.
  // =========================================================================
  {
    const res = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Andhra Pradesh",
        dialect: "Coastal Andhra",
        tone: "Clear, Calm, Informative",
        formality: "Conversational Respectful",
        slangIntensity: "none",
        channel: "Meta & Instagram Ads",
        format: "Short Video Caption",
        culturalContext: "", // Explicitly no festival
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    assert.equal(
      /పండుగ|దీపావళి|సంక్రాంతి|festival|diwali/i.test(res.naturalAdaptation),
      false,
      "GreenGlow output must NOT invent a festival reference"
    );
    assert.equal(
      /కుటుంబ ఆరోగ్య|family health/i.test(res.naturalAdaptation),
      false,
      "GreenGlow output must NOT add an unrequested family-health implication"
    );
    assert.equal(
      /గ్యారెంటీ|guaranteed/i.test(res.naturalAdaptation),
      false,
      "GreenGlow output must NOT add 'results guaranteed'"
    );
    assert.equal(
      res.hasBlockingIssues,
      false,
      "Clean GreenGlow adaptation should have zero blocking issues"
    );
    assert.equal(res.honestStatus, "Meaning check passed");
    console.log("✓ PASS [Acceptance Criterion]: GreenGlow test case verified");
    passed++;
  }

  // =========================================================================
  // 1. English to Coastal Andhra Telugu
  // =========================================================================
  {
    const res = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Andhra Pradesh",
        dialect: "Coastal Andhra",
        tone: "Warm, Informative",
        formality: "Conversational Respectful",
        slangIntensity: "none",
        channel: "Social Video & Reels",
        format: "Short Video Caption",
        culturalContext: "",
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    assert.ok(
      res.naturalAdaptation.includes("చక్కని"),
      "Coastal Andhra adaptation should use characteristic polite Coastal Andhra phrasing ('చక్కని')"
    );
    assert.ok(
      res.naturalAdaptation.includes("క్రమం తప్పకుండా వాడితే"),
      "Coastal Andhra adaptation must preserve 'with regular use' qualification"
    );
    console.log("✓ PASS [Test 1]: English to Coastal Andhra Telugu");
    passed++;
  }

  // =========================================================================
  // 2. English to Telangana Telugu
  // =========================================================================
  {
    const res = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Telangana",
        dialect: "Telangana",
        tone: "Warm, Conversational",
        formality: "Conversational Respectful",
        slangIntensity: "light",
        channel: "Social Video & Reels",
        format: "Short Video Caption",
        culturalContext: "",
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    assert.ok(
      res.naturalAdaptation.includes("మంచి తోడు") ||
        res.naturalAdaptation.includes("మన చర్మం"),
      "Telangana adaptation should use natural Telangana conversational phrasing ('మంచి తోడు')"
    );
    assert.equal(
      /గ్యారెంటీ|పండుగ/.test(res.naturalAdaptation),
      false,
      "Telangana adaptation must not add unrequested guarantees or festivals"
    );
    console.log("✓ PASS [Test 2]: English to Telangana Telugu");
    passed++;
  }

  // =========================================================================
  // 3. Dialect Non-Inference Rule (Neutral Telugu when dialect is omitted)
  // =========================================================================
  {
    const res = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Andhra Pradesh / Telangana",
        dialect: "", // Omitted
        tone: "Neutral",
        channel: "Meta & Instagram Ads",
        format: "Short Video Caption",
        culturalContext: "",
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    assert.equal(
      res.honestStatus,
      "Dialect not verified",
      "Omitting dialect must produce 'Dialect not verified' honest status rather than silently assuming a dialect"
    );
    assert.ok(
      res.languageDialectWarnings.some((w) =>
        w.includes("Dialect not specified")
      ),
      "Should emit a warning that dialect was not specified"
    );
    console.log("✓ PASS [Test 3]: Dialect non-inference & honest status check");
    passed++;
  }

  // =========================================================================
  // 4. Telugu Source to English Target
  // =========================================================================
  {
    const res = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "గ్రీన్‌గ్లో అలోవెరా జెల్ క్రమం తప్పకుండా వాడితే చర్మానికి తేమను అందిస్తుంది.",
        sourceLanguage: "Telugu",
        targetLanguage: "English",
        region: "Pan-India",
        tone: "Clear",
        channel: "Meta & Instagram Ads",
        format: "Short Video Caption",
        culturalContext: "",
        claimAtoms: [
          {
            id: "c-te-en",
            canonicalText:
              "GreenGlow Aloe Vera Gel helps keep skin hydrated with daily use.",
            lockedTokens: ["GreenGlow", "daily use"],
            sourceTitle: "GG Dossier",
            evidenceStatus: "supported",
          },
        ],
      },
      { offlineOnly: true }
    );

    assert.ok(
      res.naturalAdaptation.includes("GreenGlow") &&
        res.naturalAdaptation.toLowerCase().includes("hydrated"),
      "Telugu-to-English adaptation must accurately translate product and hydration benefit"
    );
    console.log("✓ PASS [Test 4]: Telugu source to English");
    passed++;
  }

  // =========================================================================
  // 5. Unsupported Guarantee Insertion Detection (Even when approved claim is present)
  // =========================================================================
  {
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      literalTranslation: "",
      naturalAdaptation:
        "గ్రీన్‌గ్లో (GreenGlow) అలోవెరా జెల్ 95% స్వచ్ఛమైన అలోవెరా ఆకు సారంతో తయారైంది. క్రమం తప్పకుండా వాడితే తేమను అందిస్తుంది. ఫలితాలు గ్యారెంటీ!",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh",
      dialect: "Coastal Andhra",
      culturalContext: "",
      claimAtoms: GREENGLOW_CLAIMS,
    });

    assert.equal(guardian.hasBlockingIssues, true);
    assert.equal(guardian.honestStatus, "Unsupported claim detected");
    assert.ok(
      guardian.findings.some((f) => f.category === "unsupported_guarantee"),
      "Must flag unsupported guarantee even when valid claims are present in the same text"
    );
    console.log("✓ PASS [Test 5]: Unsupported guarantee insertion flagged");
    passed++;
  }

  // =========================================================================
  // 6. Unrequested Festival Insertion Detection
  // =========================================================================
  {
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      literalTranslation: "",
      naturalAdaptation:
        "దీపావళి పండుగ వేళ గ్రీన్‌గ్లో (GreenGlow) అలోవెరా జెల్ క్రమం తప్పకుండా వాడితే చర్మానికి తేమను అందిస్తుంది.",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Telangana",
      dialect: "Telangana",
      culturalContext: "", // No festival requested!
      claimAtoms: GREENGLOW_CLAIMS,
    });

    assert.equal(guardian.hasBlockingIssues, true);
    assert.ok(
      guardian.findings.some((f) => f.category === "unrequested_cultural_ref"),
      "Must flag unrequested festival insertion when culturalContext is empty"
    );
    console.log("✓ PASS [Test 6]: Unrequested festival insertion flagged");
    passed++;
  }

  // =========================================================================
  // 7. Preservation of Approved Claims & Missing Qualification / Exaggeration Check
  // =========================================================================
  {
    // Exaggerating 95% -> 100% and omitting 'క్రమం తప్పకుండా' (with regular use)
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use. Made with 95% pure aloe vera leaf extract.",
      literalTranslation: "",
      naturalAdaptation:
        "గ్రీన్‌గ్లో (GreenGlow) అలోవెరా జెల్ 100% స్వచ్ఛమైన అలోవెరా ఆకు సారంతో తయారైంది మరియు చర్మానికి తేమను అందిస్తుంది.",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh",
      dialect: "Coastal Andhra",
      culturalContext: "",
      claimAtoms: GREENGLOW_CLAIMS,
    });

    assert.equal(guardian.hasBlockingIssues, true);
    assert.ok(
      guardian.findings.some(
        (f) => f.category === "changed_or_exaggerated_claim"
      ),
      "Must detect inflation of 95% claim to 100%"
    );
    assert.ok(
      guardian.findings.some((f) => f.category === "missing_qualification"),
      "Must detect missing 'with regular use' qualification"
    );
    console.log(
      "✓ PASS [Test 7]: Approved claim preservation, exaggeration & qualification check"
    );
    passed++;
  }

  // =========================================================================
  // 8. Awkward or Excessive English Mixing Detection
  // =========================================================================
  {
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      literalTranslation: "",
      naturalAdaptation:
        "గ్రీన్‌గ్లో (GreenGlow) super awesome gel for your daily skincare routine best results క్రమం తప్పకుండా వాడితే 95% aloe.",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Telangana",
      dialect: "Telangana",
      culturalContext: "",
      claimAtoms: GREENGLOW_CLAIMS,
    });

    assert.ok(
      guardian.findings.some((f) => f.category === "excessive_english_mixing"),
      "Must flag excessive English mixing in Telugu copy"
    );
    console.log("✓ PASS [Test 8]: Excessive English mixing flagged");
    passed++;
  }

  // =========================================================================
  // 9. Brand-Name Preservation Detection
  // =========================================================================
  {
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      literalTranslation: "",
      naturalAdaptation:
        "ఈ అలోవెరా జెల్ 95% స్వచ్ఛమైన అలోవెరా ఆకు సారంతో తయారైంది. క్రమం తప్పకుండా వాడితే చర్మానికి తేమను అందిస్తుంది.",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh",
      dialect: "Coastal Andhra",
      culturalContext: "",
      claimAtoms: GREENGLOW_CLAIMS,
    });

    assert.ok(
      guardian.findings.some((f) => f.category === "brand_name_mismatch"),
      "Must flag missing brand name when 'GreenGlow' / 'గ్రీన్‌గ్లో' is omitted"
    );
    console.log("✓ PASS [Test 9]: Brand-name preservation enforced");
    passed++;
  }

  // =========================================================================
  // 10. Missing Packaging Evidence Detection
  // =========================================================================
  {
    const guardian = verifyCompleteCopyWithGuardian({
      brandName: "GreenGlow",
      sourceText:
        "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
      literalTranslation: "",
      naturalAdaptation:
        "గ్రీన్‌గ్లో (GreenGlow) అలోవెరా జెల్ 95% స్వచ్ఛమైన అలోవెరా ఆకు సారంతో, 100% రీసైకిల్ ప్యాకేజింగ్‌తో తయారైంది. క్రమం తప్పకుండా వాడితే తేమను అందిస్తుంది.",
      sourceLanguage: "English",
      targetLanguage: "Telugu",
      region: "Andhra Pradesh",
      dialect: "Coastal Andhra",
      culturalContext: "",
      claimAtoms: GREENGLOW_CLAIMS, // No packaging evidence in claimAtoms!
    });

    assert.equal(guardian.hasBlockingIssues, true);
    assert.ok(
      guardian.findings.some(
        (f) =>
          f.id === "f-missing-packaging-evidence" &&
          f.classification === "evidence_missing"
      ),
      "Must flag unverified packaging claim when packaging evidence is missing"
    );
    console.log("✓ PASS [Test 10]: Missing packaging evidence flagged");
    passed++;
  }

  // =========================================================================
  // 11. Short Caption vs Long-Form Copy Differentiation
  // =========================================================================
  {
    const shortRes = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Andhra Pradesh",
        dialect: "Coastal Andhra",
        tone: "Calm",
        channel: "Meta & Instagram Ads",
        format: "Short Video Caption",
        culturalContext: "",
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    const longRes = await generateRegionalAdaptation(
      {
        brandName: "GreenGlow",
        sourceText:
          "GreenGlow Aloe Vera Gel helps keep skin hydrated with regular use.",
        sourceLanguage: "English",
        targetLanguage: "Telugu",
        region: "Andhra Pradesh",
        dialect: "Coastal Andhra",
        tone: "Calm",
        channel: "Meta & Instagram Ads",
        format: "Long-Form Copy",
        culturalContext: "",
        claimAtoms: GREENGLOW_CLAIMS,
      },
      { offlineOnly: true }
    );

    assert.ok(
      longRes.naturalAdaptation.length > shortRes.naturalAdaptation.length,
      "Long-form copy should provide more detailed narrative framing than short caption"
    );
    console.log(
      "✓ PASS [Test 11]: Short caption vs long-form copy differentiation"
    );
    passed++;
  }

  console.log(`\nALL ${passed}/${passed} REGIONAL ENGINE REGRESSION TESTS PASSED!`);
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
