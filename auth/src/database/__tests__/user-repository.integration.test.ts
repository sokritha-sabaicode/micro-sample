import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserRepository from "../repository/user-repository";
import DuplicateError from "../../errors/duplicate-error";
import UserModel from "../models/user.model";
import APIError from "../../errors/api-error";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe("CreateUser method", () => {
    test("should add a new user to the database", async () => {
      const MOCK_USER = {
        username: "test_user",
        email: "test_user@example.com",
        password: "test_user@1234",
      };

      const newUser = await userRepository.CreateUser(MOCK_USER);

      // Assert
      expect(newUser).toBeDefined();
      expect(newUser.username).toEqual(MOCK_USER.username);
      expect(newUser.email).toEqual(MOCK_USER.email);

      // Check if the user exists in the database
      const foundUser = await userRepository.FindUserById({ id: newUser._id as string });
      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toEqual(MOCK_USER.username);
    });

    test("should throw DuplicateError if email is already in use", async () => {
      const MOCK_EXISTING_USER = {
        username: "test_user",
        email: "test_user@example.com",
        password: "test_user@1234",
      };

      await expect(
        userRepository.CreateUser(MOCK_EXISTING_USER)
      ).rejects.toThrow(DuplicateError);
    });

    test("should throw APIError when user creation fails", async () => {
      const saveMock = jest.spyOn(UserModel.prototype, "save");
      saveMock.mockRejectedValue(new Error("Database error"));

      const MOCK_USER = {
        username: "test_user",
        email: "test_user1@example.com",
        password: "test_user@1234",
      };

      await expect(userRepository.CreateUser(MOCK_USER)).rejects.toThrow(
        APIError
      );
    });
  });
});
