import { IAuthDocument } from "../database/@types/auth.interface";
import AccountVerificationModel from "../database/models/account-verification.model";
import { AccountVerificationRepository } from "../database/repository/account-verification-repository";
import UserRepository from "../database/repository/user-repository";
import APIError from "../errors/api-error";
import DuplicateError from "../errors/duplicate-error";
import { publishDirectMessage } from "../queues/auth.producer";
import {
  UserSignInSchemaType,
} from "../schema/@types/user";
import { authChannel } from "../server";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { StatusCode } from "../utils/consts";
import {
  generatePassword,
  generateSignature,
  validatePassword,
} from "../utils/jwt";
import { logger } from "../utils/logger";

class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  // NOTE: THIS METHOD WILL USE BY SIGNUP WITH EMAIL & OAUTH
  // TODO:
  // 1. Hash The Password If Register With Email
  // 2. Save User to DB
  // 3. If Error, Check Duplication
  // 3.1. Duplication case 1: Sign Up Without Verification
  // 3.2. Duplication case 2: Sign Up With The Same Email
  async Create(userDetails: IAuthDocument) {
    try {
      // Step 1
      const hashedPassword =
        userDetails.password && (await generatePassword(userDetails.password));

      let newUserParams = { ...userDetails };

      if (hashedPassword) {
        newUserParams = { ...newUserParams, password: hashedPassword };
      }

      // Step 2
      const newUser = await this.userRepo.CreateUser({
        username: userDetails.username!,
        email: userDetails.email!,
        password: userDetails.password!,
        role: userDetails.role!,
        isVerified: userDetails.isVerified
      });

      return newUser;
    } catch (error: unknown) {
      // Step 3
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: userDetails.email!,
        });

        if (!existedUser?.isVerified) {
          // Resent the token
          const token = await this.accountVerificationRepo.FindVerificationTokenById({ id: existedUser!._id.toString() });

          if (!token) {
            logger.error(`UserService Create() method error: token not found!`)
            throw new APIError(`Something went wrong!`, StatusCode.InternalServerError)
          }

          const messageDetails = {
            receiverEmail: existedUser!.email,
            verifyLink: `${token.emailVerificationToken}`,
            template: "verifyEmail",
          };

          // Publish To Notification Service
          await publishDirectMessage(
            authChannel,
            "email-notification",
            "auth-email",
            JSON.stringify(messageDetails),
            "Verify email message has been sent to notification service"
          );

          // Throw or handle the error based on your application's needs
          throw new APIError(
            "A user with this email already exists. Verification email resent.",
            StatusCode.Conflict
          );
        } else {
          throw new APIError(
            "A user with this email already exists. Please login.",
            StatusCode.Conflict
          );
        }
      }
      throw error;
    }
  }

  // TODO
  // 1. Generate Verify Token
  // 2. Save the Verify Token in the Database
  async SaveVerificationToken({ userId }: { userId: string }) {
    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();

      // Step 2
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }

  // TODO
  // 1. Check If Token Query Exist in Collection
  // 2. Find the User Associated With This Token, Ten Update isVerified to True
  // 3. Remove Token from Collection
  async VerifyEmailToken({ token }: { token: string }) {
    // Step 1.
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });

    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }

    // Step 2.
    const user = await this.userRepo.FindUserById({
      id: isTokenExist.userId.toString(),
    });
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }

    user.isVerified = true;
    await user.save();

    // Step 3.
    await this.accountVerificationRepo.DeleteVerificationToken({ token });

    return user;
  }

  async Login(userDetails: UserSignInSchemaType) {
    // TODO:
    // 1. Find user by email
    // 2. Validate the password
    // 3. Generate Token & Return

    // Step 1
    const user = await this.userRepo.FindUser({ email: userDetails.email });

    if (!user) {
      throw new APIError("User not exist", StatusCode.NotFound);
    }

    // Step 2
    const isPwdCorrect = await validatePassword({
      enteredPassword: userDetails.password,
      savedPassword: user.password as string,
    });

    if (!isPwdCorrect) {
      throw new APIError(
        "Email or Password is incorrect",
        StatusCode.BadRequest
      );
    }

    // Step 3
    const token = await generateSignature({ userId: user._id });

    return token;
  }

  async FindUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepo.FindUser({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async UpdateUser({ id, updates }: { id: string; updates: object }) {
    try {
      const user = await this.userRepo.FindUserById({ id });
      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updatedUser = await this.userRepo.UpdateUserById({ id, updates });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
