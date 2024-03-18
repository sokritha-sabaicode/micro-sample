import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserService from "../user.service";
import DuplicateError from "../../errors/duplicate-error";

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

    expect(await userService.SignUp(MOCK_USER)).rejects.toThrow(DuplicateError);
  });
});
