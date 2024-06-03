"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("@auth/errors/api-error"));
const consts_1 = require("@auth/utils/consts");
function ipWhitelist(allowedIp) {
    return (req, _res, next) => {
        if (allowedIp.includes(req.ip)) {
            return next();
        }
        next(new api_error_1.default('Access Denied', consts_1.StatusCode.Forbidden));
    };
}
exports.default = ipWhitelist;
//# sourceMappingURL=ip-whitelist.js.map