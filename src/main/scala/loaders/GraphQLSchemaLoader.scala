package loaders

import com.typesafe.config.ConfigFactory
import graphql.{GraphQLContext, GraphQLSchema}
import sangria.schema.Field
import util.ReflectionHelper

import scala.collection.JavaConverters._

object GraphQLSchemaLoader {

  private val graphQLSchemaModuleList = ReflectionHelper.getInstances[GraphQLSchema](
    ConfigFactory.load.getList("graphql.schemas").asScala.map(
      configValue => {
        val str: java.lang.String = configValue.render
        str.substring(1, str.length - 1)
      }
    ).toList
  )

  val queries: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap {
    graphQLSchemaModule =>
      graphQLSchemaModule.queries
  }

  val mutations: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap {
    graphQLSchemaModule =>
      graphQLSchemaModule.mutations
  }

  val subscriptions: List[Field[GraphQLContext, Unit]] = graphQLSchemaModuleList.flatMap {
    graphQLSchemaModule =>
      graphQLSchemaModule.subscriptions
  }
}