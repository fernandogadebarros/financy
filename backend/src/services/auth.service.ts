import { GraphQLError } from "graphql"
import prisma from "../prisma.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { signToken } from "../utils/jwt.js"
import { USER_PUBLIC_SELECT, toUserModel } from "../utils/userMapper.js"
import { parseOrThrow } from "../utils/parseOrThrow.js"
import { registerSchema, loginSchema, updateMeSchema } from "../validators/auth.validator.js"
import type { RegisterInput, LoginInput } from "../dtos/input/auth.input.js"
import type { AuthPayload } from "../dtos/output/auth.output.js"
import type { UserModel } from "../models/user.model.js"

export class AuthService {
  async register(input: RegisterInput): Promise<AuthPayload> {
    const data = parseOrThrow(registerSchema, input)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new GraphQLError("Email already in use", { extensions: { code: "CONFLICT" } })
    }

    const password = await hashPassword(data.password)
    const created = await prisma.user.create({
      data: { name: data.name, email: data.email, password },
      select: USER_PUBLIC_SELECT,
    })

    return {
      token: signToken({ userId: created.id, email: created.email }),
      user: toUserModel(created),
    }
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const data = parseOrThrow(loginSchema, input)

    const record = await prisma.user.findUnique({ where: { email: data.email } })
    if (!record || !(await comparePassword(data.password, record.password))) {
      throw new GraphQLError("Invalid credentials", { extensions: { code: "UNAUTHENTICATED" } })
    }

    return {
      token: signToken({ userId: record.id, email: record.email }),
      user: toUserModel(record),
    }
  }

  async updateMe(userId: string, name: string): Promise<UserModel> {
    const data = parseOrThrow(updateMeSchema, { name })
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: USER_PUBLIC_SELECT,
    })
    return toUserModel(updated)
  }
}

export const authService = new AuthService()
