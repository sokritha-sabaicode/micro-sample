import express from "express";
import redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import getConfig from "@auth/utils/config";
import { RegisterRoutes } from "@auth/routes/v1/routes";
import loggerMiddleware from "@auth/middlewares/logger-handler";
import { errorHandler } from "@auth/middlewares";

const app = express();

// =======================
// Security Middlewares
// =======================
app.set("trust proxy", 1);
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// =======================
// Standard Middleware
// =======================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
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
