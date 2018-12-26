package common.shapes

import common.graphql.{Extension, UserContext}
import sangria.schema.Field

import scala.collection.mutable

trait GraphQLShape {

  lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty

  lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty

  lazy val subscriptions: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty

  lazy val extensions: mutable.HashSet[Extension[UserContext]] = mutable.HashSet.empty
}