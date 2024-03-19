import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserService from "../user.service";
import DuplicateError from "../../errors/duplicate-error";
import APIError from "../../errors/api-error";
import { UserSignUpSchemaType } from "../../schema/@types/user";

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

describe("User Service integration test", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it("should return user info & token if success", async () => {
    const MOCK_USER = {
      username: "test_user",
      email: "test_user@example.com",
      password: "test_user@1234",
    };

    const newUser = await userService.SignUp(MOCK_USER);

    expect(newUser).toBeDefined();

    // Expect that newUser has user information
    expect(newUser.user).toBeDefined();
    expect(newUser.user.username).toBe(MOCK_USER.username);
    expect(newUser.user.email).toBe(MOCK_USER.email);

    // Expect that newUser has a token
    expect(newUser.token).toBeDefined();
  });

  it("should throw a duplicate email error if the email already used", async () => {
    const MOCK_USER = {
      username: "test_user",
      email: "test_user@example.com",
      password: "test_user@1234",
    };

    await expect(userService.SignUp(MOCK_USER)).rejects.toThrow(DuplicateError);
  });

  it("should throw API error if the username is not provided", async () => {
    const INVALID_MOCK_USER = {
      email: "test_user1@example.com",
      password: "test_user@1234",
    };

    await expect(
      userService.SignUp(INVALID_MOCK_USER as UserSignUpSchemaType)
    ).rejects.toThrow(APIError);
  });

  it("should throw API error if the email is not provided", async () => {
    const INVALID_MOCK_USER = {
      username: "test_user",
      password: "test_user@1234",
    };

    await expect(
      userService.SignUp(INVALID_MOCK_USER as UserSignUpSchemaType)
    ).rejects.toThrow(APIError);
  });

  it("should throw API error if the password is not provided", async () => {
    const INVALID_MOCK_USER = {
      username: "test_user",
      email: "test_user1@example.com",
    };

    await expect(
      userService.SignUp(INVALID_MOCK_USER as UserSignUpSchemaType)
    ).rejects.toThrow(APIError);
  });
});
