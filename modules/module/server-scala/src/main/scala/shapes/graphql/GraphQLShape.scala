package shapes.graphql

import sangria.schema.Field

import scala.collection.mutable

trait GraphQLShape[Ctx, Val] {

  lazy val queries: mutable.HashSet[Field[Ctx, Val]] = mutable.HashSet.empty

  lazy val mutations: mutable.HashSet[Field[Ctx, Val]] = mutable.HashSet.empty

  lazy val subscriptions: mutable.HashSet[Field[Ctx, Val]] = mutable.HashSet.empty

  lazy val extensions: mutable.HashSet[GraphQLSchemaExtension[Ctx]] = mutable.HashSet.empty
}