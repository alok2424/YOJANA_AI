import { Router } from "express";
import { listSchemes, getSchemeBySlug } from "../Controllers/schemes.controller";

const router = Router();
router.get("/", listSchemes);
router.get("/:slug", getSchemeBySlug);
export default router;