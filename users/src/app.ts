import express, { Request, Response, NextFunction } from "express";
import { errorHandler } from "@users/middlewares/error-handler";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { urlencoded } from "body-parser";
import getConfig from "@users/utils/config";
import loggerMiddleware from "@users/middlewares/logger-handler";
import redoc from 'redoc-express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from "../public/swagger.json";
import { RegisterRoutes } from "@users/routes/v1/routes";
import { verify } from 'jsonwebtoken';
import { StatusCode } from "@users/utils/consts";
import { logger } from "@users/utils/logger";
import { publicKey } from "@users/server";

const app = express();

// Get the Configs
const config = getConfig(process.env.NODE_ENV)

// =======================
// Security Middlewares
// =======================
app.set("trust proxy", 1);
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: [`${config.apiGatewayUrl}`, `${config.authServiceUrl}`],
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
app.use(loggerMiddleware)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    console.log('token', publicKey)

    const payload = verify(token, publicKey);
    console.log('payload', payload)
    // @ts-ignore
    req.currentUser = payload;
  }
  next();
})

// ========================
// Global API V1
// ========================
RegisterRoutes(app)

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
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});
app.use(errorHandler);

export default app;
