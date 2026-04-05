import type { ExpressContextFunctionArgument } from "@as-integrations/express5"
import { verifyToken } from "../utils/jwt.js"

export type GraphqlContext = {
  userId: string | undefined
  req: ExpressContextFunctionArgument["req"]
  res: ExpressContextFunctionArgument["res"]
}

export async function buildContext({ req, res }: ExpressContextFunctionArgument): Promise<GraphqlContext> {
  const authHeader = req.headers.authorization ?? ""
  let userId: string | undefined

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    try {
      const payload = verifyToken(token)
      userId = payload.userId
    } catch {}
  }

  return { userId, req, res }
}
