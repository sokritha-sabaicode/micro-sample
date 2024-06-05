import { IAuthDocument } from "@auth/database/@types/auth.interface";
import { ICompanyDocument } from "@auth/database/@types/company.interface";
import { IUserDocument } from "@auth/database/@types/user.interface";
import APIError from "@auth/errors/api-error";
import validateInput from "@auth/middlewares/validate-input";
import { publishDirectMessage } from "@auth/queues/auth.producer";
import { ROUTE_PATHS } from "@auth/routes/v1/route-defs";
import { UserSignUpSchema, UserSignInSchema } from "@auth/schema";
import { authChannel } from "@auth/server";
import UserService from "@auth/services/user.service";
import allowRoles from "@auth/utils/allow-roles";
import getConfig from "@auth/utils/config";
import { StatusCode } from "@auth/utils/consts";
import { generateSignature } from "@auth/utils/jwt";
import { logger } from "@auth/utils/logger";
import axios from "axios";
import { Route, SuccessResponse, Post, Middlewares, Body, Get, Queries, Query } from "tsoa";


interface AxiosUserPostRequestResponse {
  data: {
    message: string;
    data: IUserDocument | ICompanyDocument
  }
}

@Route("v1/auth")
export class AuthController {
  // TODO:
  // 1. Save User
  // 2. Generate Verification Token & Save to its DB
  // 2. Publish User Detail to Notification Service
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.AUTH.SIGN_UP)
  @Middlewares(validateInput(UserSignUpSchema))
  public async SignUpWithEmail(
    @Body() requestBody: IAuthDocument
  ): Promise<any> {
    try {
      const { username, email, password, role } = requestBody;

      // Step 1.
      const userService = new UserService();
      const newUser = await userService.Create({ username: username as string, email: email as string, password, role: role });

      // Step 2.
      const verificationToken = await userService.SaveVerificationToken({ userId: newUser._id as string })

      const messageDetails = {
        receiverEmail: newUser.email,
        verifyLink: `${verificationToken.emailVerificationToken}`,
        template: "verifyEmail",
      };

      // Publish To Notification Service
      await publishDirectMessage(
        authChannel,
        "microsample-email-notification",
        "auth-email",
        JSON.stringify(messageDetails),
        "Verify email message has been sent to notification service"
      );

      return {
        message: "Sign up successfully. Please verify your email.",
        data: newUser,
      };
    } catch (error) {
      throw error;
    }
  }

  // TODO:
  // 1. Verify Token
  // 2. Check Role of User, Publish User Detail to User Service / Company Service
  // 3. Generate JWT
  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.VERIFY)
  public async VerifyEmail(@Query() token: string): Promise<{ message: string, token: string }> {
    try {
      const userService = new UserService();

      // Step 1.
      const user = await userService.VerifyEmailToken({ token });

      // Step 2.
      const userDetail = await userService.FindUserByEmail({ email: user.email! })

      if (!userDetail) {
        logger.error(`AuthController VerifyEmail() method error: user not found`)
        throw new APIError(`Something went wrong`, StatusCode.InternalServerError)
      }

      let response: AxiosUserPostRequestResponse;
      let data: IUserDocument & { authId: string } = {
        authId: userDetail._id as string,
        username: userDetail.username,
        email: userDetail.email,
        phoneNumber: userDetail.phoneNumber,
        createdAt: userDetail.createdAt
      };

      if (userDetail.role === 'USER') {
        response = await axios.post(`${getConfig(process.env.NODE_ENV).userServiceUrl}/v1/users`, data)
      } else { // ROLE: COMPANY
        response = await axios.post(`${getConfig(process.env.NODE_ENV).userServiceUrl}/v1/users`, data)
      }

      // Step 3.
      const jwtToken = await generateSignature({
        userId: response.data.data._id,
        role: userDetail.role
      });


      return { message: 'User verify email successfully', token: jwtToken };
    } catch (error) {
      logger.error(`AuthService VerifyEmail() method error: ${error}`)
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(ROUTE_PATHS.AUTH.LOGIN)
  @Middlewares(validateInput(UserSignInSchema))
  public async LoginWithEmail(
    @Body() requestBody: IAuthDocument
  ): Promise<{ message: string, token: string }> {
    try {
      const { email, password } = requestBody;

      const userService = new UserService();
      const jwtToken = await userService.Login({ email: email as string, password: password as string });

      return {
        message: 'User login successfully',
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }

  // TODO:
  // 1. Check if Provide Role is Valid
  // 2. Return the Consent Screen to Client
  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.GOOGLE)
  public async GoogleAuth(@Query() role: string) {
    allowRoles({ roleProvided: role })

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${getConfig(process.env.NODE_ENV).googleClientId}&redirect_uri=${getConfig(process.env.NODE_ENV).googleRedirectUri}&response_type=code&scope=profile email&state=${role}`;
    return { url };
  }

  // TODO:
  // 1. Check if Provide Role is Valid
  // 2. Exchange the code for tokens
  // 3. Fetch User Profile Info by Token
  // 4. Check If User Already Have Account With That Email (User Has Create Account Before Using Email/Password)
  // 4.1 If does, Check if User Have GoogleId
  // 4.1.1 If does, Means User Login With Google Before So Only Generate JWT Token
  // 4.1.2 If not, Need to Add GoogleID and isVerified to true and Generate JWT Token
  // 4.2 If not, It a New User => Create New User & Generate JWT Token
  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.GOOGLE_CALLBACK)
  public async GoogleAuthCallback(@Queries() queries: { code: string, state: string, [key: string]: any }) {
    console.log('Queries', queries)

    try {
      // Extract necessary parameters
      const { code, state } = queries;

      if (!code || !state) {
        throw new Error("'code' and 'state' parameters are required");
      }

      // Step 1.
      allowRoles({ roleProvided: state })

      // Step 2.
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        clientId: getConfig(process.env.NODE_ENV).googleClientId,
        client_secret: getConfig(process.env.NODE_ENV).googleClientSecret,
        code,
        redirect_uri: getConfig(process.env.NODE_ENV).googleRedirectUri,
        grant_type: "authorization_code",
      });

      // Step 3.
      const profile = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );

      // Step 4.
      const userService = new UserService();
      const existingUser = await userService.FindUserByEmail({
        email: profile.data.email,
      });

      // Step 4.1
      if (existingUser) {
        // Step 4.1.2
        if (!existingUser.googleId) {
          await userService.UpdateUser({
            id: existingUser._id as string,
            updates: { googleId: profile.data.id, isVerified: true },
          });
        }

        // Step 4.1.1 & 4.1.2
        const jwtToken = await generateSignature({
          userId: existingUser._id,
          role: state
        });

        return {
          token: jwtToken,
        };
      }

      // Step 4.2
      const newUser = await userService.Create({
        username: profile.data.name,
        email: profile.data.email,
        isVerified: true,
        googleId: profile.data.id,
        role: state as "USER" | "COMPANY"
      });

      const jwtToken = await generateSignature({
        userId: newUser._id,
        role: state
      });

      return {
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
