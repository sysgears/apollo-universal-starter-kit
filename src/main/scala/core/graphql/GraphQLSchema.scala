package core.graphql

import sangria.schema.Field

trait GraphQLSchema {
  def queries: List[Field[Unit, Unit]] = List.empty

  def mutations: List[Field[Unit, Unit]] = List.empty

  def subscriptions: List[Field[Unit, Unit]] = List.empty
}