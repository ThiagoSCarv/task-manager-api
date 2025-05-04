import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/config/prisma";

describe("UsersController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.users.delete({ where: { id: user_id } });
  });

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "12345678",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");

    user_id = response.body.id;
  });

  it("should throw an error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicate User",
      email: "testuser@example.com",
      password: "12345678",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("user with same email already exists");
  });

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User2",
      email: "testuser",
      password: "12345678",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
  });

});
