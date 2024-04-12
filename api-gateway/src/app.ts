import express, {
  Response,
  json,
  urlencoded,
  Request,
  NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import applyProxy from "./middlewares/proxy";
import { config } from "./index";
import { applyRateLimit } from "./middlewares/rate-limit";
import cookieSession from "cookie-session";
import hpp from "hpp";
import compression from "compression";
import { logger } from "./utils/logger";
import { StatusCode } from "./utils/consts";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

// ===================
// Security Middleware
// ===================
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: [],
    maxAge: 24 * 7 * 3600000,
    secure: false, // update with value from config
    // sameSite: none
  })
);

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Prevent Some Security:
// - Stops browsers from sharing your site's vistor data
// - Stops your website from being displayed in a frame
// - Prevent XSS, etc.
app.use(helmet());

// Only Allow Specific Origin to Access API Gateway (Frontend)
app.use(
  cors({
    origin: [config.frontend_url as string],
    credentials: true, // attach token from client
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enable CORS

// Apply Limit Request
applyRateLimit(app);

// Hide Express Server Information
app.disable("x-powered-by");

// ===================
// Standard Middleware
// ===================
app.use(compression());
app.use(json({ limit: "200mb" }));
app.use(urlencoded({ limit: "200mb", extended: true }));

// ===================
// Proxy Routes
// ===================
applyProxy(app);

// ====================
// Global Error Handler
// ====================
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});

app.use(errorHandler);

export default app;
