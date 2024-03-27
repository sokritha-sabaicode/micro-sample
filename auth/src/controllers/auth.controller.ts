import UserService from "../services/user.service";
import { Route, Post, Response, Body, Middlewares } from "tsoa";
import validateInput from "../middlewares/validate-input";
import { IUserDocument } from "../database/models/user.model";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

@Route("v1/auth")
export class AuthController {
  @Post("/signup")
  public async SignUp(
    @Body() requestBody: SignUpRequestBody
  ): Promise<IUserDocument> {
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
