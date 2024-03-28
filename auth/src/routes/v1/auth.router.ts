// import express, { NextFunction, Request } from "express";
// import validateInput from "../../middlewares/validate-input";
// import { SIGNUP_ROUTE } from "./route-defs";
// import { UserSignUpSchema } from "../../schema";
// import { AuthController } from "../../controllers/auth.controller";
// import { StatusCode } from "../../utils/consts";

// const AuthRouter = express.Router();

// AuthRouter.post(
//   SIGNUP_ROUTE,
//   validateInput(UserSignUpSchema),
//   async (req: Request, res, _next) => {
//     try {
//       const controller = new AuthController();
//       const requestBody = req.body;
//       const response = await controller.SignUp(requestBody);

//       return res.status(StatusCode.Created).json(response);
//     } catch (error) {
//       _next(error);
//     }
//   }
// );

// export default AuthRouter;
