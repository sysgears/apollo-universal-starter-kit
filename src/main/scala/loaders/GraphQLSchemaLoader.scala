package loaders

import com.typesafe.config.ConfigFactory
import graphql.{GraphQLContext, GraphQLSchema}
import injection.Injecting
import sangria.schema.Field

import scala.collection.JavaConverters._

object GraphQLSchemaLoader extends Injecting {

  val graphQLSchemasList: List[GraphQLSchema] = {
    val classLoader = getClass.getClassLoader
    ConfigFactory.load.getList("graphql.schemas").asScala.map(_.render.drop(1).dropRight(1)).toList.map {
      className =>
        val clazz = classLoader.loadClass(className)
        injector.getInstance(clazz).asInstanceOf[GraphQLSchema]
    }
  }

  val queries: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.queries)
  val mutations: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.mutations)
  val subscriptions: List[Field[GraphQLContext, Unit]] = graphQLSchemasList.flatMap(_.subscriptions)
}