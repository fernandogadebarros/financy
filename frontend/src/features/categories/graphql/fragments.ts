import { gql } from "graphql-request"

// Campos mínimos para exibição em listas e componentes (ex: TransactionRow)
export const CATEGORY_BADGE_FIELDS = gql`
  fragment CategoryBadgeFields on Category {
    id
    name
    color
    icon
  }
`

// Campos completos para a página de categorias
export const CATEGORY_FULL_FIELDS = gql`
  fragment CategoryFullFields on Category {
    id
    name
    color
    icon
    description
    _count {
      transactions
    }
  }
`
