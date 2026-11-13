import { Router } from "express";
import {
  sendNotification,
  getNotificationsByRecipientId,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} from "../controller/notification.controller.js";
import {
  validate,
  createNotificationSchema,
  getNotificationsByRecipientSchema,
  notificationIdParamSchema,
} from "../validators/index.js";

const router = Router();

// Create a new notification
router.post("/",  sendNotification);

// Get notifications by recipientId / recieptId with pagination & filters


export default router;
