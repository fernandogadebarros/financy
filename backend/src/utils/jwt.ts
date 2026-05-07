import jwt, { type SignOptions } from "jsonwebtoken"
import { z } from "zod"
import { env } from "../config.js"

const tokenPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
})

export type JwtPayload = z.infer<typeof tokenPayloadSchema>

export function signToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn })
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  return tokenPayloadSchema.parse(decoded)
}
