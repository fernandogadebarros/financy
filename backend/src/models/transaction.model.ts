import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql"
import { CategoryModel } from "./category.model.js"

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

registerEnumType(TransactionType, { name: "TransactionType" })

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Int)
  amount!: number

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  date!: Date

  @Field(() => CategoryModel)
  category!: CategoryModel

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
