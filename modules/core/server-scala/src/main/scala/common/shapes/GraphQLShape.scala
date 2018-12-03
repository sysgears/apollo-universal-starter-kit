package common.shapes

import core.graphql.UserContext
import sangria.schema.Field

trait GraphQLShape {

  val queries: List[Field[UserContext, Unit]] = List.empty

  val mutations: List[Field[UserContext, Unit]] = List.empty

  val subscriptions: List[Field[UserContext, Unit]] = List.empty
}