import { IUserDocument } from "@users/database/@types/user.interface";
import UserRepository from "@users/database/repositories/user.repository";
import { logger } from "@users/utils/logger";

class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  // TODO:
  // 1. Save User
  async Create(userDetails: IUserDocument & { authId: string }) {
    try {
      // Step 2
      const newUser = await this.userRepo.CreateUser(userDetails);

      return newUser;
    } catch (error: unknown) {
      logger.error(`UserService Create() method error: ${error}`)
      throw error;
    }
  }

  // TODO:
  // 1. Update User
  async UpdateById(id: string, modifiedData: IUserDocument) {
    try {
      // Step 2
      const modifiedUser = await this.userRepo.UpdateUserById({id, updates: modifiedData});

      return modifiedUser;
    } catch (error: unknown) {
      logger.error(`UserService UpdateById() method error: ${error}`)
      throw error;
    }
  }
}

export default UserService;
