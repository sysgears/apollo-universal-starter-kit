package loaders

import graphql.{GraphQLContext, GraphQLSchema}
import core.guice.injection.Injecting.loadClasses
import sangria.schema.Field

object GraphQLSchemaLoader {
  val graphQLSchemasList: List[GraphQLSchema] = loadClasses[GraphQLSchema]("graphql.schemas")

  val queries: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.queries)
  val mutations: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.mutations)
  val subscriptions: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.subscriptions)
}