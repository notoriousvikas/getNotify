import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    totalUsage: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Usage =
  mongoose.models.Usage || mongoose.model("Usage", usageSchema);

export default Usage;
