import { Arg, FieldResolver, ID, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql"
import { GraphQLError } from "graphql"
import { TransactionService } from "../services/transaction.service.js"
import { TransactionModel } from "../models/transaction.model.js"
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js"
import { IsAuth } from "../middlewares/auth.middleware.js"
import { GqlUser } from "../graphql/decorators/user.decorator.js"
import { UserModel } from "../models/user.model.js"

@Resolver(() => TransactionModel)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @FieldResolver(() => String)
  date(@Root() transaction: { date: Date }): string {
    return transaction.date.toISOString()
  }

  @Query(() => [TransactionModel])
  @UseMiddleware(IsAuth)
  async transactions(@GqlUser() user: UserModel | null): Promise<TransactionModel[]> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.transactionService.findAll(user.id)
  }

  @Query(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async transaction(
    @Arg("id", () => ID) id: string,
    @GqlUser() user: UserModel | null
  ): Promise<TransactionModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.transactionService.findOne(id, user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg("input", () => CreateTransactionInput) input: CreateTransactionInput,
    @GqlUser() user: UserModel | null
  ): Promise<TransactionModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.transactionService.create(input, user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateTransactionInput) input: UpdateTransactionInput,
    @GqlUser() user: UserModel | null
  ): Promise<TransactionModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.transactionService.update(id, input, user.id)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg("id", () => ID) id: string,
    @GqlUser() user: UserModel | null
  ): Promise<boolean> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.transactionService.delete(id, user.id)
  }
}
