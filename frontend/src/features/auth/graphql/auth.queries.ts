import { gql } from "graphql-request"

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`

export const UPDATE_ME_MUTATION = gql`
  mutation UpdateMe($name: String!) {
    updateMe(name: $name) {
      id
      name
      email
    }
  }
`
