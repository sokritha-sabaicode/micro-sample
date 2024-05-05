import { IUserDocument } from "@users/database/@types/user.interface";
import authorization from "@users/middlewares/authorization";
import validateInput from "@users/middlewares/validate-input";
import ROUTE_PATHS from "@users/routes/v1/route-defs";
import { UserSaveSchema, UserUpdateSchema } from "@users/schema/user-schema";
import UserService from "@users/services/user.service";
import { StatusCode } from "@users/utils/consts";
import { logger } from "@users/utils/logger";
import { Body, Middlewares, Path, Post, Put, Route, SuccessResponse } from "tsoa";


@Route("v1/users")
export class UserController {
  // TODO:
  // 1. Save User
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.SAVE_USER)
  @Middlewares(validateInput(UserSaveSchema))
  public async SaveProfileUser(
    @Body() requestBody: IUserDocument & { authId: string }
  ): Promise<any> {
    try {
      // Step 1.
      const userService = new UserService();
      const newUser = await userService.Create(requestBody);

      return {
        message: "User profile create successfully",
        data: newUser,
      };
    } catch (error) {
      logger.error(`UserService UserController() method error: ${error}`)
      throw error;
    }
  }

  // TODO:
  // 1. Save User
  @SuccessResponse(StatusCode.OK, "OK")
  @Put(ROUTE_PATHS.UPDATE_USER)
  @Middlewares(authorization(['USER']))
  @Middlewares(validateInput(UserUpdateSchema))
  public async UpdateProfileUser(
    @Path() userId: string,
    @Body() requestBody: IUserDocument
  ): Promise<any> {
    try {
      // Step 1.
      const userService = new UserService();
      const modifiedUser = await userService.UpdateById(userId, requestBody);

      return {
        message: "User profile update successfully",
        data: modifiedUser,
      };
    } catch (error) {
      logger.error(`UserService UserController() method error: ${error}`)
      throw error;
    }
  }
}
