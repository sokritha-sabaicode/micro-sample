import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Global Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.disable("x-powered-by"); // Hide Express Server Information


