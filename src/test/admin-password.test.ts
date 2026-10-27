import { describe, expect, it } from "vitest";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/password.server";

describe("admin password rules", () => {
  it("rejects new passwords shorter than 8 characters", () => {
    expect(passwordProblem("short12")).toBe("Use at least 8 characters.");
    expect(passwordProblem("longenough")).toBeNull();
  });

  it("accepts only the matching password after hashing", async () => {
    const stored = await hashPassword("correct-horse", 1000);
    expect(await verifyPassword("correct-horse", stored)).toBe(true);
    expect(await verifyPassword("wrong-horse", stored)).toBe(false);
  });
});
