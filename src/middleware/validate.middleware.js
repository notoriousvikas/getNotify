import { z } from "zod";

/**
 * Format Zod issues into a standardized, developer-friendly list
 */
const formatZodIssues = (issues, defaultSource) => {
  return issues.map((issue) => {
    const rawPath = issue.path || [];
    let source = defaultSource;
    let field = rawPath.join(".");

    // If path starts with body, query, params, or headers, extract it as the source
    if (rawPath.length > 0 && ["body", "query", "params", "headers"].includes(rawPath[0])) {
      source = rawPath[0];
      field = rawPath.slice(1).join(".") || rawPath[0];
    }

    return {
      source,
      field,
      message: issue.message,
      code: issue.code,
    };
  });
};

/**
 * Global Zod Validation Middleware for Express routes.
 *
 * Supports flexible usage patterns:
 *
 * Pattern 1 - Target map:
 *   validate({
 *     body: createNotificationSchema,
 *     params: idParamSchema,
 *     query: paginationSchema,
 *   })
 *
 * Pattern 2 - Direct Zod schema (defaults to req.body):
 *   validate(registerUserSchema)
 *
 * Pattern 3 - Direct Zod schema with specified target:
 *   validate(recipientParamSchema, "params")
 *   validate(filterQuerySchema, "query")
 *
 * Pattern 4 - Combined Zod Object containing top-level { body, query, params }:
 *   validate(z.object({
 *     body: z.object({...}),
 *     query: z.object({...})
 *   }))
 *
 * @param {import("zod").ZodType | { body?: import("zod").ZodType, query?: import("zod").ZodType, params?: import("zod").ZodType, headers?: import("zod").ZodType }} schema
 * @param {"body" | "query" | "params" | "headers"} [defaultSource="body"]
 */
export const validate = (schema, defaultSource = "body") => {
  return async (req, res, next) => {
    try {
      if (!schema) {
        return next();
      }

      const isZodInstance = typeof schema?.safeParseAsync === "function";

      // Pattern 1: Plain object containing target schemas: { body, query, params, headers }
      if (!isZodInstance && typeof schema === "object") {
        const errors = [];
        const targets = ["body", "query", "params", "headers"];

        for (const target of targets) {
          const targetSchema = schema[target];
          if (targetSchema && typeof targetSchema.safeParseAsync === "function") {
            const dataToValidate = req[target] ?? {};
            const result = await targetSchema.safeParseAsync(dataToValidate);

            if (!result.success) {
              errors.push(...formatZodIssues(result.error.issues, target));
            } else {
              // Assign parsed, coerced, and sanitized data back to req[target]
              req[target] = result.data;
            }
          }
        }

        if (errors.length > 0) {
          return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors,
          });
        }

        return next();
      }

      // Pattern 4: Top-level Zod object with body/query/params/headers shapes
      if (
        isZodInstance &&
        schema.shape &&
        (schema.shape.body || schema.shape.query || schema.shape.params || schema.shape.headers)
      ) {
        const payload = {
          body: req.body ?? {},
          query: req.query ?? {},
          params: req.params ?? {},
          headers: req.headers ?? {},
        };

        const result = await schema.safeParseAsync(payload);

        if (!result.success) {
          return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors: formatZodIssues(result.error.issues, defaultSource),
          });
        }

        if (result.data.body !== undefined) req.body = result.data.body;
        if (result.data.query !== undefined) req.query = result.data.query;
        if (result.data.params !== undefined) req.params = result.data.params;
        return next();
      }

      // Pattern 2 & 3: Direct schema targeting defaultSource (req.body, req.query, or req.params)
      if (isZodInstance) {
        const target = defaultSource;
        const dataToValidate = req[target] ?? {};
        const result = await schema.safeParseAsync(dataToValidate);

        if (!result.success) {
          return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors: formatZodIssues(result.error.issues, target),
          });
        }

        req[target] = result.data;
        return next();
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
