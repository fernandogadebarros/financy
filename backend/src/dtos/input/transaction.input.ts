import { Field, ID, InputType, Int } from "type-graphql"
import { TransactionType } from "../../models/transaction.model.js"

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string

  @Field(() => Int)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  date!: string

  @Field(() => ID)
  categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Int, { nullable: true })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => ID, { nullable: true })
  categoryId?: string
}
