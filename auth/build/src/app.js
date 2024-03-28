"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const logger_handler_1 = __importDefault(require("./middlewares/logger-handler"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../public/swagger.json"));
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
// =======================
// Global Middlewares
// =======================
// Access Request Body (JSON)
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Logger
app.use(logger_handler_1.default);
// ========================
// Global API V1
// ========================
(0, routes_1.RegisterRoutes)(app);
// define title and specUrl location
// serve redoc
app.get("/docs", (0, redoc_express_1.default)({
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
}));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// ========================
// Global Error Handler
// ========================
app.use(middlewares_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map