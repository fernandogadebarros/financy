import { describe, expect, it } from "vitest"
import { createCategorySchema, updateCategorySchema } from "../category.validator.js"

describe("createCategorySchema", () => {
  it("accepts valid input", () => {
    const result = createCategorySchema.parse({
      name: "Food",
      color: "#FF8800",
      icon: "burger",
      description: "meals",
    })
    expect(result.name).toBe("Food")
  })

  it("rejects non-hex color", () => {
    expect(() =>
      createCategorySchema.parse({ name: "X", color: "red", icon: "tag" }),
    ).toThrow()
  })

  it("rejects empty name", () => {
    expect(() =>
      createCategorySchema.parse({ name: "", color: "#000000", icon: "tag" }),
    ).toThrow()
  })

  it("accepts optional null description", () => {
    const result = createCategorySchema.parse({
      name: "X",
      color: "#000000",
      icon: "tag",
      description: null,
    })
    expect(result.description).toBeNull()
  })
})

describe("updateCategorySchema", () => {
  it("accepts an empty patch", () => {
    expect(updateCategorySchema.parse({})).toEqual({})
  })

  it("rejects empty string name (not just undefined)", () => {
    expect(() => updateCategorySchema.parse({ name: "" })).toThrow()
  })

  it("rejects malformed color", () => {
    expect(() => updateCategorySchema.parse({ color: "blue" })).toThrow()
  })
})
