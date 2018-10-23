package core.graphql

import sangria.schema.Field

trait GraphQLSchema {
  def queries: List[Field[Unit, Unit]]

  def mutations: List[Field[Unit, Unit]]

  def subscriptions: List[Field[Unit, Unit]]
}