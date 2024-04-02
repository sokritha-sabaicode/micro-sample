import { ObjectId } from "mongoose";
import APIError from "../../errors/api-error";
import DuplicateError from "../../errors/duplicate-error";
import UserModel from "../models/user.model";
import {
  UserCreateRepository,
  UserUpdateRepository,
} from "./@types/user-repository.type";
import { StatusCode } from "../../utils/consts";

class UserRepository {
  async CreateUser(userDetail: UserCreateRepository) {
    try {
      // Check for existing user with the same email
      const existingUser = await this.FindUser({ email: userDetail.email });
      if (existingUser) {
        throw new DuplicateError("Email already in use");
      }

      const user = new UserModel(userDetail);

      const userResult = await user.save();
      return userResult;
    } catch (error) {
      console.log("error", error);
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new APIError("Unable to Create User in Database");
    }
  }

  async FindUser({ email }: { email: string }) {
    try {
      const existingUser = await UserModel.findOne({ email: email });
      return existingUser;
    } catch (error) {
      throw new APIError("Unable to Find User in Database");
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
    updates: UserUpdateRepository;
  }) {
    try {
      const isExist = await this.FindUserById({ id });
      if (!isExist) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }

      const newUpdateUser = await UserModel.findByIdAndUpdate(id, updates, {
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
