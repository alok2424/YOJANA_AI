import { EligibilityInputSchema } from "../validators/eligibility.schema.js";
import { findEligibleSchemes } from "../services/eligibility.service.js";

export async function checkEligibility(req, res, next) {
  try {
    const parsed = EligibilityInputSchema.parse(req.body);
    const matches = await findEligibleSchemes(parsed, 20);
    res.json({ matches });
  } catch (err) {
    next(err);
  }
}