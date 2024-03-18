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

    const userService = new UserService();
    const newUser = await userService.SignUp({ username, email, password });

    res.status(StatusCode.Created).json({
      data: newUser.user,
      token: newUser.token,
    });
  } catch (error) {
    _next(error);
  }
};
