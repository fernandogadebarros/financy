import { Field, ObjectType } from "type-graphql"
import { UserModel } from "../../models/user.model.js"

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string

  @Field(() => UserModel)
  user!: UserModel
}
