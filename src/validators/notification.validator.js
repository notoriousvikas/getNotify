import { z } from "zod";
import { objectIdSchema, channelEnum, paginationQuerySchema } from "./common.validator.js";

/**
 * Validation schema for creating a notification
 */
export const createNotificationSchema = z.object({
  projectId: objectIdSchema,
  recipientId: z
    .string({
      required_error: "recipientId (or recieptId) is required",
    })
    .trim()
    .min(1, "Recipient ID cannot be empty"),
  title: z.string().trim().max(200, "Title cannot exceed 200 characters").optional(),
  body: z.string().trim().max(2000, "Body cannot exceed 2000 characters").optional(),
  
  channel: channelEnum,
});

/**
 * Validation schema for retrieving notifications by recipientId / recieptId
 */
export const getNotificationsByRecipientSchema = {
  params: z
    .object({
      recipientId: z.string().trim().min(1).optional(),
      recieptId: z.string().trim().min(1).optional(),
    })
    .refine((data) => data.recipientId || data.recieptId, {
      message: "recipientId (or recieptId) parameter is required",
    }),
  query: paginationQuerySchema.extend({
    projectId: objectIdSchema.optional(),
    channel: channelEnum.optional(),
    read: z.enum(["true", "false"]).optional(),
  }),
};

/**
 * Validation schema for notification ID route param
 */
export const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});
