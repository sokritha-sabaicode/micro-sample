import { IUser } from "../database/models/user.model";
import UserRepository from "../database/repository/user-repository";
import { UserSignUpSchemaType } from "../schema/@types/user";
import { generatePassword, generateSignature } from "../utils/jwt";
import { UserSignUpResult } from "./@types/user-service.type";

class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Create a new user with the provided details.
   * Passwords are hashed before storage for security.
   *
   * @param {IUser} userDetails - The details of the user to create.
   * @returns {Promise<UserSignUpResult>} The created user.
   */

  async SignUp(userDetails: UserSignUpSchemaType): Promise<UserSignUpResult> {
    try {
      const { username, email, password } = userDetails;

      // Convert User Password to Hash Password
      const hashedPassword = await generatePassword(password);

      // Save User to Database
      const newUser = await this.repository.CreateUser({
        username,
        email,
        password: hashedPassword,
      });

      // Generate JWT Token for User to Access
      const token = await generateSignature({ email, _id: newUser._id });

      // Return Response
      return { user: newUser, token };
    } catch (error: unknown) {
      throw error;
    }
  }

  /**
   * Find a user by their email.
   *
   * @param {string} email - The email of the user to find.
   * @returns {Promise<Object|null>} The found user or null if not found.
   */
  // async findUserByEmail(email) {
  //   const user = await db.User.findOne({ where: { email } });
  //   return user;
  // }

  /**
   * Update user information.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {Object} updates - The updates to apply to the user.
   * @returns {Promise<Object>} The updated user.
   */

  // async updateUser(userId, updates) {
  //   const user = await db.User.findByPk(userId);
  //   if (!user) {
  //     throw new Error("User not found");
  //   }
  //   const updatedUser = await user.update(updates);
  //   return updatedUser;
  // }

  /**
   * Delete a user by their ID.
   *
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<boolean>} True if the user was deleted, false otherwise.
   */

  // async deleteUser(userId) {
  //   const deleted = await db.User.destroy({ where: { id: userId } });
  //   return deleted;
  // }
}

export default UserService;
