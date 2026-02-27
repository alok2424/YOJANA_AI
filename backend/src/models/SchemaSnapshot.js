import mongoose from "mongoose";

const SchemeSnapshotSchema = new mongoose.Schema(
  {
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", index: true },
    hash: { type: String, required: true, index: true },
    raw: { type: Object, required: true }, // raw parsed payload
    fetchedAt: { type: Date, default: () => new Date(), index: true }
  },
  { timestamps: true }
);

export const SchemeSnapshot = mongoose.model("SchemeSnapshot", SchemeSnapshotSchema);   