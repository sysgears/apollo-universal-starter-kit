package loaders

import com.typesafe.config.ConfigFactory
import graphql.{GraphQLContext, GraphQLSchema}
import sangria.schema.Field
import util.ReflectionHelper.getInstances

import scala.collection.JavaConverters._

object GraphQLSchemaLoader {

  private val graphQLSchemaModuleList = getInstances[GraphQLSchema] {
    ConfigFactory.load.getList("graphql.schemas").asScala.map(_.render.drop(1).dropRight(1)).toList
  }

  val queries: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap(_.queries)
  val mutations: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap(_.mutations)
  val subscriptions: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap(_.subscriptions)
}