import APIError from "../../errors/api-error";
import DuplicateError from "../../errors/duplicate-error";
import UserModel from "../models/user.model";
import { UserCreateRepository } from "./@types/user-repository.type";

class UserRepository {
  async CreateUser({ username, email, password }: UserCreateRepository) {
    try {
      // Check for existing user with the same email
      const existingUser = await this.FindUser({ email });
      if (existingUser) {
        throw new DuplicateError("Email already in use");
      }

      const user = new UserModel({
        username,
        email,
        password,
      });

      const userResult = await user.save();
      return userResult;
    } catch (error) {
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
      return null;
    }
  }

  async FindUserById({ id }: { id: String }) {
    try {
      const existingUser = await UserModel.findById(id);

      return existingUser;
    } catch (error) {
      throw new APIError("Unable to Find User in Database");
    }
  }
}

export default UserRepository;
