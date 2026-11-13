import { z } from "zod";
import { objectIdSchema, channelEnum } from "./common.validator.js";

export const createProviderSchema = z.object({
  projectId: objectIdSchema.optional(),
  provider: z.string().trim().min(1, "Provider name is required"),
  channel: channelEnum,
  type: z.enum(["system", "custom"]).default("custom"),
  apiKey: z.string().trim().optional(),
  config: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export const updateProviderSchema = z.object({
  provider: z.string().trim().min(1).optional(),
  channel: channelEnum.optional(),
  apiKey: z.string().trim().optional(),
  config: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export const providerIdParamSchema = z.object({
  id: objectIdSchema,
});
