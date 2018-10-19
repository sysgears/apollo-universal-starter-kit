package core.graphql

import sangria.schema.Field

trait GraphQLSchema {
  def queries: List[Field[GraphQLContext, Unit]]

  def mutations: List[Field[GraphQLContext, Unit]]

  def subscriptions: List[Field[GraphQLContext, Unit]]
}