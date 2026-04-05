import { GraphQLError } from "graphql"
import prisma from "../prisma.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { signToken } from "../utils/jwt.js"
import type { RegisterInput, LoginInput } from "../dtos/input/auth.input.js"

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new GraphQLError("Email already in use", { extensions: { code: "BAD_USER_INPUT" } })
    }

    const hashed = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    })

    const token = signToken({ userId: user.id, email: user.email })
    return { token, user }
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      throw new GraphQLError("Invalid credentials", { extensions: { code: "UNAUTHENTICATED" } })
    }

    const valid = await comparePassword(data.password, user.password)
    if (!valid) {
      throw new GraphQLError("Invalid credentials", { extensions: { code: "UNAUTHENTICATED" } })
    }

    const token = signToken({ userId: user.id, email: user.email })
    return { token, user }
  }

  async updateMe(userId: string, name: string) {
    return prisma.user.update({ where: { id: userId }, data: { name } })
  }
}
