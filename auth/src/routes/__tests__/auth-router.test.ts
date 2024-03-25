import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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

describe("POST /signup", () => {
  it("should create a new user when provided with valid input", async () => {
    const MOCK_USER = {
      username: "test_user",
      email: "test_user@example.com",
      password: "test_user@1234",
    };

    const response = await request(app)
      .post("/v1/auth/signup")
      .send(MOCK_USER)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.data.username).toBe(MOCK_USER.username);
    expect(response.body.data.email).toBe(MOCK_USER.email);
  }, 50000);
});
