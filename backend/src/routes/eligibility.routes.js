import { Router } from "express";
import { checkEligibility } from "../Controllers/eligibility.controller";

const router = Router();
router.post("/check", checkEligibility);
export default router;