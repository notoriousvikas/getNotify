import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  status: {
  type: String,
  enum: [
    "queued",
    "processing",
    "sent",
    "delivered",
    "failed"
  ],
  default: "queued",
},


  recipientId: {
    type: String,
    required: true,
  },
  to:{
    type: String,
  },
  title: String,
  body: String,

  data: mongoose.Schema.Types.Mixed,

  channel: {
    type: String,
    enum: ["in_app", "email", "sms", "push"],
    required: true,
  },

  readAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for fast queries by project and recipient
notificationSchema.index({ projectId: 1, recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);