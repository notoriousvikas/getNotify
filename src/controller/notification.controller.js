import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";
import { Project } from "../models/project.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";
import {sendNotificationService} from "../services/sendNotification/sendNotfication.service.js";
const ALLOWED_CHANNELS = ["in_app", "email", "sms", "push"];

// @desc    Create a new notification
// @route   POST /api/notifications
export const sendNotification = catchAsync(async (req, res) => {
  // console.log(req.body)
  const {
    title,
    to,
    body,
    data,
    channel,
  } = req.body;
 // Log the request body for debugging
  // Support both recipientId and recieptId
  const recipientId = req.body.recipientId || req.body.recieptId;

  // Support projectId from body, route params, or attached project
  const projectId = req.body.projectId || req.params.projectId || req.project?._id;

  if (!projectId) {
    throw new AppError("Project ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid Project ID format", 400);
  }

  if (!recipientId) {
    throw new AppError("Recipient ID (recipientId/recieptId) is required", 400);
  }

  if (!channel) {
    console.log("throw channel error")
    throw new AppError("Notification channel is required", 400);
  }

  if (!ALLOWED_CHANNELS.includes(channel)) {
    throw new AppError(
      `Invalid channel. Allowed channels: ${ALLOWED_CHANNELS.join(", ")}`,
      400
    );
  }

  // Verify that the project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  const r=await Notification.create({
          projectId,
          recipientId,
          title,
          body,
          data,
          channel
      });
      // console.log("R",r)
  //  console.log(to,recipientId,title)
  if(channel!=="in_app"){
  const notification = await sendNotificationService(projectId,to, recipientId, title, body, data,channel);
  }
  res.status(202).json({
    status: "success",
    data: r,
  });
});

export const getNotificationsByRecipientId = catchAsync(async (req, res) => {
  // Support recipientId / recieptId from params or query
  const recipientId =
    req.params.recipientId ||
    req.params.recieptId ||
    req.query.recipientId ||
    req.query.recieptId;

  if (!recipientId) {
    throw new AppError("Recipient ID is required", 400);
  }

  const projectId = req.query.projectId || req.params.projectId || req.project?._id;
  const channel = req.query.channel;
  const read = req.query.read;

  // Build filter query
  const filter = { recipientId };

  if (projectId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid Project ID format", 400);
    }
    filter.projectId = projectId;
  }

  if (channel) {
    if (!ALLOWED_CHANNELS.includes(channel)) {
      throw new AppError(
        `Invalid channel filter. Allowed channels: ${ALLOWED_CHANNELS.join(", ")}`,
        400
      );
    }
    filter.channel = channel;
  }

  if (read !== undefined) {
    if (read === "true") {
      filter.readAt = { $ne: null };
    } else if (read === "false") {
      filter.readAt = null;
    }
  }

  // Pagination support
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: notifications.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: notifications,
  });
});

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
export const getNotificationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Notification ID format", 400);
  }

  const notification = await Notification.findById(id).populate(
    "projectId",
    "name slug"
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
});


export const markNotificationAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Notification ID format", 400);
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    { readAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
    data: notification,
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Notification ID format", 400);
  }

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully",
  });
});

// Aliases for flexibility and matching various naming conventions
export const getNotificationByRecipientId = getNotificationsByRecipientId;
export const getByReceiptId = getNotificationsByRecipientId;
export const getByRecipientId = getNotificationsByRecipientId;
