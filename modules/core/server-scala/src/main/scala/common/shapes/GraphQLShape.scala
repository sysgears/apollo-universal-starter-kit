package common.shapes

import common.graphql.UserContext
import sangria.schema.Field

import scala.collection.mutable

trait GraphQLShape {

  val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty

  val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty

  val subscriptions: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet.empty
}