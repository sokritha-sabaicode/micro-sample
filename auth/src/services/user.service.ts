import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/user.model";

class UserService {
  /**
   * Create a new user with the provided details.
   * Passwords are hashed before storage for security.
   *
   * @param {IUser} userDetails - The details of the user to create.
   * @returns {Promise<IUser>} The created user.
   */

  static async createUser(userDetails: IUser): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      const user = new UserModel({
        ...userDetails,
        password: hashedPassword,
      });
      await user.save();
      return user;
    } catch (error: unknown) {
      throw new Error("");
    }
  }

  /**
   * Find a user by their email.
   *
   * @param {string} email - The email of the user to find.
   * @returns {Promise<Object|null>} The found user or null if not found.
   */
  // static async findUserByEmail(email) {
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

  // static async updateUser(userId, updates) {
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

  // static async deleteUser(userId) {
  //   const deleted = await db.User.destroy({ where: { id: userId } });
  //   return deleted;
  // }
}

module.exports = UserService;
