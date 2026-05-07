import type { UserModel } from "../models/user.model.js"

export const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const

export type PublicUser = {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt?: Date
}

export function toUserModel(user: PublicUser): UserModel {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}
