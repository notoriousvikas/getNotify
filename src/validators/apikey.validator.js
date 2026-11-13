import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

/**
 * Validation schema for creating an API key
 */
export const createApiKeySchema = z.object({
  name: z
    .string({ required_error: "API key name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters"),
  projectId: objectIdSchema,
});
