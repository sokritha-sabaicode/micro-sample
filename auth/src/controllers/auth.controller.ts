import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { UserSignUpSchemaType } from "../schema/@types/user";
import { StatusCode } from "../utils/consts";

export const SignUp = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { username, email, password } = req.body as UserSignUpSchemaType;

    // Save User
    const userService = new UserService();
    const newUser = await userService.SignUp({ username, email, password });

    // Send Email Verification
    await userService.SendVerifyEmailToken({ userId: newUser.user._id });

    res.status(StatusCode.Created).json({
      data: newUser.user,
    });
  } catch (error) {
    _next(error);
  }
};
