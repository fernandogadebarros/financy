import { gql } from "graphql-request"
import { CATEGORY_FULL_FIELDS } from "./fragments"

export const GET_CATEGORIES = gql`
  ${CATEGORY_FULL_FIELDS}
  query GetCategories {
    categories {
      ...CategoryFullFields
    }
  }
`

export const CREATE_CATEGORY = gql`
  ${CATEGORY_FULL_FIELDS}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFullFields
    }
  }
`

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FULL_FIELDS}
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFullFields
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
