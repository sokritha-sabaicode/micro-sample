import UserService from "../services/user.service";
import {
  Route,
  Post,
  Body,
  Middlewares,
  SuccessResponse,
  Query,
  Get,
} from "tsoa";
import validateInput from "../middlewares/validate-input";
import { IUser } from "../database/models/user.model";
import { UserSignUpSchema } from "../schema";
import { StatusCode } from "../utils/consts";
import { ROUTE_PATHS } from "../routes/v1/route-defs";
import { generateSignature } from "../utils/jwt";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

@Route("v1/auth")
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

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.VERIFY)
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      const userService = new UserService();

      // Verify the email token
      const user = await userService.VerifyEmailToken({ token });

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });

      return { token: jwtToken };
    } catch (error) {
      throw error;
    }
  }
}
