import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./schemas";

describe("auth schemas", () => {
  it("accepts valid login values", () => {
    const result = loginSchema.safeParse({
      email: "maya@example.com",
      password: "password123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects short passwords", () => {
    const result = registerSchema.safeParse({
      name: "Maya",
      email: "maya@example.com",
      password: "short"
    });

    expect(result.success).toBe(false);
  });
});
