import AccountVerificationModel from "../database/models/account-verification.model";
import UserRepository from "../database/repository/user-repository";
import APIError from "../errors/api-error";
import { UserSignUpSchemaType } from "../schema/@types/user";
import { generateEmailVerificationToken } from "../utils/account-verification";
import EmailSender from "../utils/email-sender";
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

      // Return Response
      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  async SendVerifyEmailToken({ userId }: { userId: string }) {
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    // 3. Get the Info User By Id
    // 4. Send the Email to the User

    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();

      // Step 2
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });
      const newAccountVerification = await accountVerification.save();

      // Step 3
      const existedUser = await this.repository.FindUserById({ id: userId });
      if (!existedUser) {
        throw new APIError("User does not exist!");
      }

      // Step 4
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: existedUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
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
