import { Scheme } from "../models/Scheme.js";

function withinRange(value, min, max) {
  if (value == null) return true;
  if (min != null && value < min) return false;
  if (max != null && value > max) return false;
  return true;
}

function intersects(a = [], b = []) {
  const setB = new Set(b.map((x) => x.toLowerCase()));
  return a.some((x) => setB.has(String(x).toLowerCase()));
}

export async function findEligibleSchemes(input, limit = 20) {
  const { age, incomeAnnual, state, gender, categoryTags, casteGroup } = input;

  // DB prefilter (coarse) - keep simple for MVP
  const query = {
    status: "ACTIVE",
    $and: [
      {
        $or: [
          { stateScope: "ALL_INDIA" },
          { stateScope: "STATE", states: state }
        ]
      }
    ]
  };

  // Optional: prefilter by categories if provided
  if (categoryTags?.length) {
    query.$and.push({
      $or: [
        { categories: { $in: categoryTags } },
        { "eligibilityRule.categoryTags": { $in: categoryTags } }
      ]
    });
  }

  const candidates = await Scheme.find(query).limit(500).lean(); // cap for speed

  // Fine filter + scoring
  const results = [];

  for (const s of candidates) {
    const r = s.eligibilityRule || {};

    // Hard filters: age/income/gender
    if (!withinRange(age, r.minAge, r.maxAge)) continue;
    if (incomeAnnual != null && !withinRange(incomeAnnual, r.incomeMin, r.incomeMax)) continue;

    if (r.gender && r.gender !== "ALL" && gender && r.gender !== gender) continue;

    // Optional filters
    if (r.casteGroups?.length && casteGroup) {
      const ok = r.casteGroups.map(x => x.toLowerCase()).includes(casteGroup.toLowerCase());
      if (!ok) continue;
    }

    // Score
    let score = 0;
    const why = [];

    // state match
    if (s.stateScope === "ALL_INDIA") { score += 10; why.push("All-India scheme"); }
    else { score += 15; why.push(`Available in ${state}`); }

    // category match
    if (categoryTags?.length) {
      const matched =
        intersects(s.categories, categoryTags) || intersects(r.categoryTags, categoryTags);
      if (matched) { score += 25; why.push("Matches your category"); }
    }

    // completeness bonus
    if ((s.documents?.length || 0) >= 3) score += 3;
    if ((s.applySteps?.length || 0) >= 3) score += 3;

    // recency bonus
    const days = Math.floor((Date.now() - new Date(s.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 30) score += 5;

    results.push({
      schemeId: s._id,
      title: s.title,
      slug: s.slug,
      summary: s.summary,
      deadlineText: s.deadlineText,
      sourceUrl: s.sourceUrl,
      lastVerifiedAt: s.lastVerifiedAt,
      score,
      whyMatched: why
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}