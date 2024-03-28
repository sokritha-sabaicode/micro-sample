import UserService from "../services/user.service";
import { Route, Post, Body, Middlewares, SuccessResponse } from "tsoa";
import validateInput from "../middlewares/validate-input";
import { IUser } from "../database/models/user.model";
import { UserSignUpSchema } from "../schema";
import { StatusCode } from "../utils/consts";
import { ROUTE_PATHS } from "../routes/v1/route-defs";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

@Route(ROUTE_PATHS.AUTH.BASE)
export class AuthController {
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.AUTH.SIGN_UP)
  @Middlewares(validateInput(UserSignUpSchema))
  public async SignUp(@Body() requestBody: SignUpRequestBody): Promise<IUser> {
    try {
      const { username, email, password } = requestBody;

      // Save User
      const userService = new UserService();
      const newUser = await userService.SignUp({ username, email, password });

      // Send Email Verification
      await userService.SendVerifyEmailToken({ userId: newUser._id });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
