import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";

import { Project } from "../models/project.model.js";
import { enqueueEmail } from "../queue/producer/email.producer.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";
import {sendNotificationService} from "../services/sendNotification/sendNotfication.service.js";
const ALLOWED_CHANNELS = ["in_app", "email", "sms", "push"];

// @desc    Create a new notification
// @route   POST /api/notifications
export const dashboard = catchAsync(
    async(req,res)=>{
          const {
        page = 1,
        limit = 10,
        
    } = req.query;
      const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
       const {projectId} = req.params;
       if(!projectId){
        throw new AppError("project id is required",400)
       } 
       const cachekey = `dashboard:${projectId}`
       const skip = (pageNumber - 1) * limitNumber;
       const notifications = await Notification.find({
        projectId:projectId
       }).sort({createdAt:-1}).skip(skip).limit(limitNumber).lean();
       if(!notifications){
        throw new AppError("failed to find notifications",404)
       }
       return res.status(200).json({
        data:notifications,
        
       })
    }
)

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






// Aliases for flexibility and matching various naming conventions
export const getNotificationByRecipientId = getNotificationsByRecipientId;
export const getByReceiptId = getNotificationsByRecipientId;
export const getByRecipientId = getNotificationsByRecipientId;
