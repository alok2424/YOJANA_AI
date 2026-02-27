import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import { Scheme } from "../models/Scheme.js";

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function run() {
  await connectDB(process.env.MONGODB_URI);

  await Scheme.deleteMany({});

  const schemes = [
    {
      title: "Example Student Scholarship Scheme",
      slug: slugify("Example Student Scholarship Scheme"),
      stateScope: "STATE",
      states: ["Uttar Pradesh"],
      categories: ["Student"],
      summary: "Scholarship support for eligible students.",
      benefits: ["Financial assistance", "Fee support"],
      documents: ["Aadhaar", "Income certificate", "Bank passbook", "School/College ID"],
      applySteps: ["Check eligibility", "Fill application", "Upload documents", "Submit"],
      officialLinks: [{ label: "Official Portal", url: "https://example.gov.in" }],
      deadlineText: "Ongoing",
      eligibilityText: "Age 18-25, income under 3L, UP resident.",
      eligibilityRule: {
        minAge: 18,
        maxAge: 25,
        incomeMax: 300000,
        gender: "ALL",
        categoryTags: ["student"],
        stateRequired: true
      },
      sourceUrl: "https://example.gov.in/scheme/example-student"
    }
  ];

  await Scheme.insertMany(schemes);
  console.log("✅ Seeded schemes:", schemes.length);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});