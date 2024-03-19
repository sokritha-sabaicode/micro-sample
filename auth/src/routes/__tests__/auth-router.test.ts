import request from "supertest";
import app from "../../app";

describe("POST /signup", () => {
  it("should create a new user when provided with valid input", async () => {
    const MOCK_USER = {
      username: "test_user",
      email: "test_user@example.com",
      password: "test_user@1234",
    };

    const response = await request(app)
      .post("/signup")
      .send(MOCK_USER)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.data.username).toBe(MOCK_USER.username);
    expect(response.body.data.email).toBe(MOCK_USER.email);
    expect(response.body.token).toBeDefined();
  });
});
