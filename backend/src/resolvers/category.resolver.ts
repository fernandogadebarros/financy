import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from "type-graphql"
import { CategoryService } from "../services/category.service.js"
import { CategoryModel } from "../models/category.model.js"
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js"
import { IsAuth } from "../middlewares/auth.middleware.js"
import { GqlUser } from "../graphql/decorators/user.decorator.js"
import { UserModel } from "../models/user.model.js"
import { GraphQLError } from "graphql"

@Resolver()
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  @UseMiddleware(IsAuth)
  async categories(@GqlUser() user: UserModel | null): Promise<CategoryModel[]> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.categoryService.findAll(user.id)
  }

  @Query(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async category(
    @Arg("id", () => ID) id: string,
    @GqlUser() user: UserModel | null
  ): Promise<CategoryModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.categoryService.findOne(id, user.id)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async createCategory(
    @Arg("input", () => CreateCategoryInput) input: CreateCategoryInput,
    @GqlUser() user: UserModel | null
  ): Promise<CategoryModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.categoryService.create(input, user.id)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateCategoryInput) input: UpdateCategoryInput,
    @GqlUser() user: UserModel | null
  ): Promise<CategoryModel> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.categoryService.update(id, input, user.id)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteCategory(
    @Arg("id", () => ID) id: string,
    @GqlUser() user: UserModel | null
  ): Promise<boolean> {
    if (!user) throw new GraphQLError("User not found", { extensions: { code: "NOT_FOUND" } })
    return this.categoryService.delete(id, user.id)
  }
}
