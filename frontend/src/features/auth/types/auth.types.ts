export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthPayload {
  token: string
  user: AuthUser
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  login: AuthPayload
}

export interface RegisterResponse {
  register: AuthPayload
}

export interface MeResponse {
  me: AuthUser
}
