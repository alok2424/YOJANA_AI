import { Scheme } from "../models/Scheme.js";

export async function listSchemes(req, res, next) {
  try {
    const { q, state, category, limit = 20, skip = 0 } = req.query;

    const query = { status: "ACTIVE" };

    if (q) query.title = { $regex: String(q), $options: "i" };
    if (state) {
      query.$or = [{ stateScope: "ALL_INDIA" }, { stateScope: "STATE", states: String(state) }];
    }
    if (category) query.categories = { $in: [String(category)] };

    const items = await Scheme.find(query)
      .sort({ lastVerifiedAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 50))
      .select("title slug summary stateScope states categories deadlineText sourceUrl lastVerifiedAt")
      .lean();

    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getSchemeBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const scheme = await Scheme.findOne({ slug, status: "ACTIVE" }).lean();
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json({ scheme });
  } catch (err) {
    next(err);
  }
}