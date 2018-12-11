package common.graphql.schema

import common.graphql.UserContext
import sangria.schema.Field

trait GraphQLSchema {
  def queries: List[Field[UserContext, Unit]] = List.empty

  def mutations: List[Field[UserContext, Unit]] = List.empty

  def subscriptions: List[Field[UserContext, Unit]] = List.empty
}
