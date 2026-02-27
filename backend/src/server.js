import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8080;

async function main() {
  await connectDB(process.env.MONGODB_URI);
  const app = createApp();

  app.listen(PORT, () => {
    console.log(` API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(" Failed to start server:", err);
  process.exit(1);
});