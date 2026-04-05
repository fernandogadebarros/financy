import jwt, { type SignOptions } from "jsonwebtoken"

export interface JwtPayload {
  userId: string
  email: string
}

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export function signToken(payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "7d"): string {
  return jwt.sign(payload, requireEnv("JWT_SECRET"), { expiresIn })
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, requireEnv("JWT_SECRET"))
  if (typeof decoded === "string" || typeof (decoded as JwtPayload).userId !== "string") {
    throw new Error("Invalid token payload")
  }
  return decoded as JwtPayload
}
