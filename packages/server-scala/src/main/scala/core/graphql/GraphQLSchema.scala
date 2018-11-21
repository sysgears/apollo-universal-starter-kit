package core.graphql

import sangria.schema.Field

trait GraphQLSchema {
  def queries: List[Field[UserContext, Unit]] = List.empty

  def mutations: List[Field[UserContext, Unit]] = List.empty

  def subscriptions: List[Field[UserContext, Unit]] = List.empty
}