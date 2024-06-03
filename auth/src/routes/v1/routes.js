"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const health_controller_1 = require("./../../controllers/health.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./../../controllers/auth.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "IAuthDocument": {
        "dataType": "refObject",
        "properties": {
            "_id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "email": { "dataType": "string" },
            "password": { "dataType": "string" },
            "phoneNumber": { "dataType": "string" },
            "role": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["COMPANY"] }, { "dataType": "enum", "enums": ["USER"] }] },
            "isVerified": { "dataType": "boolean" },
            "googleId": { "dataType": "string" },
            "createdAt": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] },
            "updatedAt": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/auth-health', ...((0, runtime_1.fetchMiddlewares)(health_controller_1.Health)), ...((0, runtime_1.fetchMiddlewares)(health_controller_1.Health.prototype.checkHealth)), function Health_checkHealth(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new health_controller_1.Health();
            templateService.apiHandler({
                methodName: 'checkHealth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/auth/signup', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.SignUpWithEmail)), function AuthController_SignUpWithEmail(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "IAuthDocument" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new auth_controller_1.AuthController();
            templateService.apiHandler({
                methodName: 'SignUpWithEmail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/auth/verify', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.VerifyEmail)), function AuthController_VerifyEmail(request, response, next) {
        const args = {
            token: { "in": "query", "name": "token", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new auth_controller_1.AuthController();
            templateService.apiHandler({
                methodName: 'VerifyEmail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/auth/login', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.LoginWithEmail)), function AuthController_LoginWithEmail(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "IAuthDocument" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new auth_controller_1.AuthController();
            templateService.apiHandler({
                methodName: 'LoginWithEmail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/auth/google', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.GoogleAuth)), function AuthController_GoogleAuth(request, response, next) {
        const args = {
            role: { "in": "query", "name": "role", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new auth_controller_1.AuthController();
            templateService.apiHandler({
                methodName: 'GoogleAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/auth/google/callback', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.GoogleAuthCallback)), function AuthController_GoogleAuthCallback(request, response, next) {
        const args = {
            queries: { "in": "queries", "name": "queries", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "state": { "dataType": "string", "required": true }, "code": { "dataType": "string", "required": true } }, "additionalProperties": { "dataType": "any" } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args, request, response });
            const controller = new auth_controller_1.AuthController();
            templateService.apiHandler({
                methodName: 'GoogleAuthCallback',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map