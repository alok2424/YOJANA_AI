import { z } from "zod";

export const EligibilityInputSchema = z.object({
  age: z.number().int().min(0).max(120),
  incomeAnnual: z.number().int().min(0).optional(),
  state: z.string().min(2),
  gender: z.enum(["M", "F", "O"]).optional(),
  categoryTags: z.array(z.string().min(1)).default([]),
  casteGroup: z.string().min(1).optional()
});