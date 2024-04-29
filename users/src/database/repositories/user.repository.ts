import { IUserDocument } from "@users/database/@types/user.interface";
import UserModel from "@users/database/models/user.model";
import APIError from "@users/errors/api-error";
import DuplicateError from "@users/errors/duplicate-error";
import { StatusCode } from "@users/utils/consts";

class UserRepository {
  async createUser(userDetail: IUserDocument) {
    try {
      // Check for existing user with the same email
      const existingUser = await this.FindUserByEmail({ email: userDetail.email! })
      if (existingUser) {
        throw new DuplicateError('Email already in use');
      }

      const user = new UserModel(userDetail);
      const userResult = await user.save();
      return userResult;
    } catch (error) {
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new APIError('Unable to Create User in Database')
    }
  }

  async FindUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await UserModel.findOne({ email: email })
      return existingUser;
    } catch (error) {
      throw new APIError('Unable to Find User in Database')
    }
  }

  async FindUserById({ id }: { id: string }) {
    try {
      const existingUser = await UserModel.findById(id);

      return existingUser;
    } catch (error) {
      throw new APIError("Unable to Find User in Database");
    }
  }

  async UpdateUserById({
    id,
    updates,
  }: {
    id: string;
    updates: IUserDocument;
  }) {
    try {
      const isExist = await this.FindUserById({ id });
      if (!isExist) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }

      const newUpdateUser = await UserModel.findByIdAndUpdate(id, {
        $set: {
          username: updates.username,
          profile: updates.profile,
          phoneNumber: updates.phoneNumber,
        }
      }, {
        new: true,
      });

      return newUpdateUser;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError("Unable to Update User in Database");
    }
  }
}

export default UserRepository;