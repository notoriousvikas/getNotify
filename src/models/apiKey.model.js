import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
      description: "Friendly name for identifying the key (e.g. 'Production Server')",
    },
    // The cryptographically hashed key (never store plaintext API keys)
    keyHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Masked representation shown in UI after creation (e.g. 'gnt_live_abc1...xyz9')
    maskedKey: {
      type: String,
      required: true,
    },
    // Fast prefix lookup (e.g. 'gnt_live_')
    keyPrefix: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    // Scopes / permissions assigned to this API key
    permissions: {
      type: [String],
      default: ["*"], // Wildcard or specific scopes e.g. ['notifications:send', 'read']
    },
    // Rate limit configuration per key
    rateLimit: {
      maxRequests: {
        type: Number,
        default: 1000, // e.g. 1000 requests
      },
      windowInSeconds: {
        type: Number,
        default: 3600, // per hour
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null means never expires
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helper static method: Generate a secure random API key and its hash
apiKeySchema.statics.generateApiKey = function (prefix = "gnt_live_") {
  // Generate 32 bytes of secure entropy
  const entropy = crypto.randomBytes(32).toString("hex");
  const rawKey = `${prefix}${entropy}`;

  // Hash using SHA-256 for fast, one-way storage
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  // Create masked string (prefix + first 4 chars + '...' + last 4 chars)
  const maskedKey = `${rawKey.slice(0, prefix.length + 4)}...${rawKey.slice(-4)}`;

  return { rawKey, keyHash, maskedKey, keyPrefix: prefix };
};

// Helper static method: Hash a raw incoming key to find its document in the DB
apiKeySchema.statics.hashKey = function (rawKey) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};

// Helper method: Check whether the key is valid (active and not expired)
apiKeySchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
};

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
