import express from "express";
import cors from "cors";
import helmet from "helmet";
import applyProxy from "./middlewares/proxy";
import { config } from "./index";
import { applyRateLimit } from "./middlewares/rate-limit";

const app = express();

// Global Middleware
// Only Allow Specific Origin to Access API Gateway (Frontend)
app.use(
  cors({
    origin: [config.frontend_url as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enable CORS

// Apply Limit Request
applyRateLimit(app);

// Prevent Some Security:
// - Stops browsers from sharing your site's vistor data
// - Stops your website from being displayed in a frame
// - Prevent XSS, etc.
app.use(helmet());

// Hide Express Server Information
app.disable("x-powered-by");

// Proxy Routes
applyProxy(app);

export default app;
