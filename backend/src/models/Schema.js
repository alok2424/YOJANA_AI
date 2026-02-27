import mongoose from "mongoose";

const EligibilityRuleSchema = new mongoose.Schema(
  {
    minAge: { type: Number, default: null },
    maxAge: { type: Number, default: null },
    incomeMin: { type: Number, default: null }, // annual INR
    incomeMax: { type: Number, default: null },
    gender: { type: String, enum: ["ALL", "M", "F", "O"], default: "ALL" },
    casteGroups: { type: [String], default: [] }, // optional
    categoryTags: { type: [String], default: [] }, // farmer/student/women/msme
    stateRequired: { type: Boolean, default: false }
  },
  { _id: false }
);

const SchemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },

    // scope
    stateScope: { type: String, enum: ["ALL_INDIA", "STATE"], required: true, index: true },
    states: { type: [String], default: [], index: true }, // e.g. ["Uttar Pradesh"]
    categories: { type: [String], default: [], index: true }, // e.g. ["Student","Women"]

    summary: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    applySteps: { type: [String], default: [] },

    officialLinks: {
      type: [
        {
          label: String,
          url: String
        }
      ],
      default: []
    },

    deadlineText: { type: String, default: "Ongoing" },

    eligibilityText: { type: String, default: "" },
    eligibilityRule: { type: EligibilityRuleSchema, default: {} },

    sourceUrl: { type: String, required: true },
    lastVerifiedAt: { type: Date, default: () => new Date(), index: true },
    status: { type: String, enum: ["ACTIVE", "DEPRECATED"], default: "ACTIVE", index: true }
  },
  { timestamps: true }
);

// Helpful indexes for filtering
SchemeSchema.index({ status: 1, stateScope: 1, states: 1, categories: 1 });
SchemeSchema.index({ "eligibilityRule.categoryTags": 1 });

export const Scheme = mongoose.model("Scheme", SchemeSchema);