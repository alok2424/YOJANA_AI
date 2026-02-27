import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import schemesRoutes from "./routes/schemes.routes.js";
import eligibilityRoutes from "./routes/eligibility.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/schemes", schemesRoutes);
  app.use("/api/eligibility", eligibilityRoutes);

  // lock admin later with auth middleware
  app.use("/api/admin", adminRoutes);

  app.use(errorHandler);
  return app;
}