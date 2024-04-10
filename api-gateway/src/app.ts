import express from "express";
import cors from "cors";
import helmet from "helmet";
import applyProxy from "./utils/proxy";

const app = express();

// Global Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.disable("x-powered-by"); // Hide Express Server Information

// Proxy Routes
applyProxy(app);

export default app;
