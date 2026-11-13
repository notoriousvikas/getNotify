import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    setting: {
      enabledChannels: {
        type: [String],
        default: ["email", "push"],
      },
      defaultLanguage: {
        type: String,
        default: "en",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ organizationId: 1, slug: 1 }, { unique: true });

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
