"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../errors/api-error"));
const consts_1 = require("./consts");
function allowRoles({ acceptRoles = ["USER", "COMPANY"], roleProvided }) {
    if (!acceptRoles.includes(roleProvided)) {
        throw new api_error_1.default(`Invalid role specified`, consts_1.StatusCode.BadRequest);
    }
}
exports.default = allowRoles;
//# sourceMappingURL=allow-roles.js.map