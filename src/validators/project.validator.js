import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";


export const createProjectSchema = {
  body: z.object({
    organizationId: objectIdSchema.optional(),
    name: z
      .string({ required_error: "Project name is required" })
      .trim()
      .min(1, "Project name cannot be empty")
      .max(50, "Project name cannot exceed 50 characters"),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .max(60, "Slug cannot exceed 60 characters")
      .optional(),
    description: z.string().trim().max(200, "Description cannot exceed 200 characters").optional(),
    setting: z
      .object({
        enabledChannels: z.array(z.string()).optional(),
        defaultLanguage: z.string().optional(),
      })
      .optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
  params: z
    .object({
      organizationId: objectIdSchema.optional(),
    })
    .optional(),
};


export const updateProjectSchema = {
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().trim().min(1).max(50).optional(),
      slug: z.string().trim().toLowerCase().max(60).optional(),
      description: z.string().trim().max(200).optional(),
      setting: z
        .object({
          enabledChannels: z.array(z.string()).optional(),
          defaultLanguage: z.string().optional(),
        })
        .optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
};


export const projectIdParamSchema = z.object({
  projectId: objectIdSchema,
});

export const organizationIdParamSchema = z.object({
  organizationId: objectIdSchema,
});
