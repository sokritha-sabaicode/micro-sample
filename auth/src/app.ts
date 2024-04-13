import express from "express";
import { errorHandler } from "./middlewares";
import loggerMiddleware from "./middlewares/logger-handler";
import redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import { RegisterRoutes } from "./routes/v1/routes";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import { config } from ".";
import compression from "compression";
import { urlencoded } from "body-parser";

const app = express();

// =======================
// Security Middlewares
// =======================
app.set("trust proxy", 1);
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: config.apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// =======================
// Standard Middleware
// =======================
app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(urlencoded({ extended: true, limit: "200mb" }));
app.use(express.static("public"));

// Logger
app.use(loggerMiddleware);

// ========================
// Global API V1
// ========================
RegisterRoutes(app);

// API Documentation
app.get(
  "/wiki-docs",
  redoc({
    title: "API Docs",
    specUrl: "/swagger.json",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

export default app;
