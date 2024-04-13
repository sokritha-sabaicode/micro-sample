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
import { UserSignInSchema, UserSignUpSchema } from "../schema";
import { StatusCode } from "../utils/consts";
import { ROUTE_PATHS } from "../routes/v1/route-defs";
import { generateSignature } from "../utils/jwt";
import axios from "axios";
import { publishDirectMessage } from "../queues/auth.producer";
import { authChannel } from "..";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

@Route("v1/auth")
export class AuthController {
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.AUTH.SIGN_UP)
  @Middlewares(validateInput(UserSignUpSchema))
  public async SignUpWithEmail(@Body() requestBody: SignUpRequestBody): Promise<IUser> {
    try {
      // TODO:
      // 1. Save User
      // 2. Send User Detail to Notification Service
      // 3. Send User Detail to User Service

      const { username, email, password } = requestBody;

      // Save User
      const userService = new UserService();
      const newUser = await userService.Create({ username, email, password });

      // [Old Version] - Send Email Verification
      await userService.SendVerifyEmailToken({ userId: newUser._id });

      const messageDetails = {
        username: newUser.username,
        email: newUser.email,
        type: "auth",
      };

      // [New Version] - Publish To Notification Service / User Service
      // await publishDirectMessage(
      //   authChannel,
      //   "micro-user-update",
      //   "user",
      //   JSON.stringify(messageDetails),
      //   "User details sent to User Service"
      // );

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

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(ROUTE_PATHS.AUTH.LOGIN)
  @Middlewares(validateInput(UserSignInSchema))
  public async LoginWithEmail(
    @Body() requestBody: LoginRequestBody
  ): Promise<{ token: string }> {
    try {
      const { email, password } = requestBody;

      const userService = new UserService();
      const jwtToken = await userService.Login({ email, password });

      return {
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.GOOGLE)
  public async GoogleAuth() {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    return { url };
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.GOOGLE_CALLBACK)
  public async GoogleAuthCallback(@Query() code: string) {
    try {
      // Exchange the code for tokens
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        clientId: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      });

      // Fetch user profile
      const profile = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );

      const userService = new UserService();
      const existingUser = await userService.FindUserByEmail({
        email: profile.data.email,
      });

      if (existingUser) {
        // User Exists, link the Google account if it's not already linked
        if (!existingUser.googleId) {
          await userService.UpdateUser({
            id: existingUser._id,
            updates: { googleId: profile.data.id, isVerified: true },
          });
        }

        // Now, proceed to log the user in
        const jwtToken = await generateSignature({
          userId: existingUser._id,
        });

        return {
          token: jwtToken,
        };
      }

      // No user exists with this email, create a new user
      const newUser = await userService.Create({
        username: profile.data.name,
        email: profile.data.email,
        isVerified: true,
        googleId: profile.data.id,
      });

      const jwtToken = await generateSignature({
        userId: newUser._id,
      });

      return {
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
