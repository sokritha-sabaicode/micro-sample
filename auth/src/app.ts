import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares";
import AuthRouter from "./routes/v1/auth.router";
import loggerMiddleware from "./middlewares/logger-handler";
import redoc from "redoc-express";

const app = express();

// =======================
// Global Middlewares
// =======================

// Access Request Body (JSON)
app.use(express.json());
app.use(express.static("public"));

// Logger
app.use(loggerMiddleware);

// ========================
// Global API V1
// ========================
app.use("/v1", AuthRouter);

// serve your swagger.json file
app.get("/docs", (req, res) => {
  res.sendFile(`swagger.json`, { root: "./public" });
});

// define title and specUrl location
// serve redoc
app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/swagger.json",
    nonce: "", // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
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

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

export default app;
