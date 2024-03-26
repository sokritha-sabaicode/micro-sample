import { NextFunction, RequestHandler } from "express";
import UserService from "../services/user.service";
import { UserSignUpSchemaType } from "../schema/@types/user";
import { StatusCode } from "../utils/consts";
import { Route, Post, Response, Body, Middlewares } from "tsoa";
import validateInput from "../middlewares/validate-input";
import { UserSignUpSchema } from "../schema";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
  // Add any other properties if present in the Zod schema
}

@Route("auth")
export class AuthController {
  @Post("/signup")
  public async SignUp(@Body() requestBody: SignUpRequestBody): Promise<any> {
    try {
      const { username, email, password } = requestBody;

      // Save User
      const userService = new UserService();
      const newUser = await userService.SignUp({ username, email, password });

      // Send Email Verification
      await userService.SendVerifyEmailToken({ userId: newUser.user._id });

      return newUser.user;
    } catch (error) {
      throw error;
    }
  }
}
