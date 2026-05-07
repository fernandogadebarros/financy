import { describe, expect, it } from "vitest"
import { comparePassword, hashPassword } from "../hash.js"

describe("hash utils", () => {
  it("hashes and compares the same password successfully", async () => {
    const hashed = await hashPassword("super-secret-pass")
    expect(hashed).not.toBe("super-secret-pass")
    expect(await comparePassword("super-secret-pass", hashed)).toBe(true)
  })

  it("rejects wrong passwords", async () => {
    const hashed = await hashPassword("correct-pass")
    expect(await comparePassword("wrong-pass", hashed)).toBe(false)
  })

  it("produces a different hash for the same password (random salt)", async () => {
    const a = await hashPassword("same")
    const b = await hashPassword("same")
    expect(a).not.toBe(b)
  })
})
