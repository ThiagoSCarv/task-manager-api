import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/config/prisma";

describe("SessionsControllers", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.users.delete({ where: { id: user_id } });
  });

  it("should authenticate and get access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Auth Test User",
      email: "auth_test_user@example.com",
      password: "12345678",
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post("/sessions").send({
      email: "auth_test_user@example.com",
      password: "12345678",
    });

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  });
});