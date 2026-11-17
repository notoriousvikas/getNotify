import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null, // null for system/platform-wide providers
      index: true,
    },
    // Provider name (e.g., 'resend', 'smtp', 'sendgrid', 'twilio', 'fcm')
    provider: {
      type: String,
     
      required: true,

      trim: true,
      lowercase: true,
    },
    // Notification channel handled by this provider
    channel: {
      type: String,
      enum: ["email", "sms", "push", "in_app"],
      required: true,
    },
    // 'system' = our built-in provider, 'custom' = bring your own provider (BYOP)
    type: {
      type: String,
      enum: ["system", "custom"],
      default: "custom",
    },
    // API key for API-driven providers (Resend, SendGrid, Twilio, etc.)
    apiKey: {
      type: String,
      trim: true,
      default: null,
    },
    credentials:{
        from:{type: String, trim:true},
        apiKey:{type: String, trim:true},
        apiSecret:{type: String, trim:true},
        accountSid:{type: String, trim:true}

    },
    // Additional credentials & settings (e.g., SMTP or sender details)
    config: {
      fromEmail: { type: String, trim: true },
      fromName: { type: String, trim: true },
      // SMTP specific settings
      host: { type: String, trim: true },
      port: { type: Number },
      username: { type: String, trim: true },
      password: { type: String },
      secure: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Fast query index to find the active provider for a project and channel
providerSchema.index({ projectId: 1, channel: 1, isActive: 1 });

export const Provider =
  mongoose.models.Provider || mongoose.model("Provider", providerSchema);

export default Provider;
