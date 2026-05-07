import { gql } from "graphql-request"

export const CATEGORY_BADGE_FIELDS = gql`
  fragment CategoryBadgeFields on Category {
    id
    name
    color
    icon
  }
`

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
