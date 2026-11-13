import {Notification} from '../models/notification.model.js';
import {catchAsync, AppError} from '../middleware/error.middleware.js';

const getNotifications = catchAsync(async (req, res) => {
    const { recipientId } = req.query;
    const projectId = req.projectId;
    if (!recipientId) {
        throw new AppError("Recipient ID (recipientId) is required", 400);
    }
    const notifications = await Notification.find({ recipientId,projectId,channel:"in_app" }).sort({ createdAt: -1 });
    return res.status(200).
    json({
        message:"success",
        data:notifications
    })
})

const markNotificationAsRead = catchAsync(async (req, res) => {
    const { notificationId } = req.params;
    if (!notificationId) {
        throw new AppError("Notification ID (notificationId) is required", 400);
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new AppError("Notification not found", 404);
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({
        status: "success",
        data: notification,
    });
})

const deleteNotification = catchAsync(async (req, res) => {
    const { notificationId } = req.params;
    if (!notificationId) {
        throw new AppError("Notification ID (notificationId) is required", 400);
    }
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
        throw new AppError("Notification not found", 404);
    }
    res.status(200).json({
        status: "success",
        message: "Notification deleted successfully",
    });
})

const getUnreadNotificationsCount = catchAsync(async (req, res) => {
    const { recipientId } = req.query;
    if (!recipientId) {
        throw new AppError("Recipient ID (recipientId) is required", 400);
    }
    const count = await Notification.countDocuments({ recipientId, read: false });
    res.status(200).json({
        status: "success",
        data: { unreadCount: count },
    });
})

export {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    getUnreadNotificationsCount
}