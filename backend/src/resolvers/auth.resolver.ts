import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql"
import { GraphQLError } from "graphql"
import { authService } from "../services/auth.service.js"
import { RegisterInput, LoginInput } from "../dtos/input/auth.input.js"
import { AuthPayload } from "../dtos/output/auth.output.js"
import { UserModel } from "../models/user.model.js"
import { IsAuth } from "../middlewares/auth.middleware.js"
import { GqlUser } from "../graphql/decorators/user.decorator.js"

@Resolver()
export class AuthResolver {
  @Query(() => UserModel)
  @UseMiddleware(IsAuth)
  async me(@GqlUser() user: UserModel | null): Promise<UserModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return user
  }

  @Mutation(() => AuthPayload)
  async register(@Arg("input", () => RegisterInput) input: RegisterInput): Promise<AuthPayload> {
    return authService.register(input)
  }

  @Mutation(() => AuthPayload)
  async login(@Arg("input", () => LoginInput) input: LoginInput): Promise<AuthPayload> {
    return authService.login(input)
  }

  @Mutation(() => UserModel)
  @UseMiddleware(IsAuth)
  async updateMe(
    @Arg("name", () => String) name: string,
    @GqlUser() user: UserModel | null,
  ): Promise<UserModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return authService.updateMe(user.id, name)
  }
}
