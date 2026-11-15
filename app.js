import express from "express";
import { AppError, errorHandler } from "./src/middleware/error.middleware.js";
import cors from "cors"
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import hpp from "hpp";
// Routes
import notificationRouter from "./src/routes/notification.route.js";
import userRouter from "./src/routes/user.route.js";
import projectRouter from "./src/routes/project.route.js";
import apiKeyRouter from "./src/routes/apikey.route.js";
import providerRouter from "./src/routes/provider.route.js";
import OrganizationRouter from "./src/routes/organization.route.js";
import InboxRouter from "./src/routes/inbox.route.js";
import DashboardRouter from "./src/routes/dashboard.route.js"



dotenv.config();
const app = express();

// app.use(
//   helmet({
//     strictTransportSecurity:
//       process.env.NODE_ENV === "production"
//         ? undefined
//         : false,
//   })
// );

// Standard middleware

const allowedOrigins = (
  process.env.CORS_ORIGINS || ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests without an Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new AppError("CORS not allowed", 403));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Key",
    ],
    maxAge: 86400,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use('/api',globalLimiter);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser({

})); // Optional cookie parser middleware if installed
// Optional cookie parser middleware if installed

// app.use(hpp());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/api-keys", apiKeyRouter);
app.use("/api/v1/providers", providerRouter);
app.use("/api/v1/organizations", OrganizationRouter);
app.use("/api/v1/inbox", InboxRouter);
app.use("/api/v1/dashboard",DashboardRouter)

// Handle unhandled routes (404)

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use(errorHandler);

export default app;
