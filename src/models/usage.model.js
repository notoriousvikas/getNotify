import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    organizationId: {
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
    maxLimit:{
      type:Number,
      default:1000
    },

    resetAt:{
      type:Date,
      default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  {
    timestamps: true,
  }
);

export const Usage =
  mongoose.models.Usage || mongoose.model("Usage", usageSchema);

export default Usage;
