import { z } from "zod";


export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid 24-character hexadecimal ObjectId");


export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Notification channels supported by the system
 */
export const channelEnum = z.enum(["in_app", "email", "sms", "push"], {
  errorMap: () => ({
    message: "Channel must be one of: 'in_app', 'email', 'sms', 'push'",
  }),
});
