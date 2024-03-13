import express from "express";
import validateInput from "../middlewares/validate-input";
import { SIGNUP_ROUTE } from "./route-defs";
import { UserSignUpSchema } from "../schema";

const AuthRouter = express.Router();

AuthRouter.post(SIGNUP_ROUTE, validateInput(UserSignUpSchema));
