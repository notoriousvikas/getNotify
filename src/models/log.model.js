import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      default: null,
      index: true,
    },
    method: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number, // Response time in milliseconds
      required: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Query logs by project ordered by most recent
logSchema.index({ projectId: 1, createdAt: -1 });

// Automatically clean up logs older than 30 days
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);

export default Log;
