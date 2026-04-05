import { gql } from "graphql-request"
import { CATEGORY_BADGE_FIELDS } from "../../categories/graphql/fragments"

export const GET_TRANSACTIONS = gql`
  ${CATEGORY_BADGE_FIELDS}
  query GetTransactions {
    transactions {
      id
      title
      amount
      type
      date
      category {
        ...CategoryBadgeFields
      }
    }
  }
`

export const CREATE_TRANSACTION = gql`
  ${CATEGORY_BADGE_FIELDS}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      title
      amount
      type
      date
      category {
        ...CategoryBadgeFields
      }
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  ${CATEGORY_BADGE_FIELDS}
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      title
      amount
      type
      date
      category {
        ...CategoryBadgeFields
      }
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
