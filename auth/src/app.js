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
const redoc_express_1 = __importDefault(require("redoc-express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../public/swagger.json"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("@auth/utils/config"));
const routes_1 = require("@auth/routes/v1/routes");
const logger_handler_1 = __importDefault(require("@auth/middlewares/logger-handler"));
const middlewares_1 = require("@auth/middlewares");
const app = (0, express_1.default)();
// =======================
// Security Middlewares
// =======================
app.set("trust proxy", 1);
app.use((0, hpp_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (0, config_1.default)().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
// =======================
// Standard Middleware
// =======================
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "200mb" }));
app.use(express_1.default.static("public"));
// Logger
app.use(logger_handler_1.default);
// ========================
// Global API V1
// ========================
(0, routes_1.RegisterRoutes)(app);
// API Documentation
app.get("/wiki-docs", (0, redoc_express_1.default)({
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