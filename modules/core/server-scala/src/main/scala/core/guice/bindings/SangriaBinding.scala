package core.guice.bindings

import com.google.inject.{Provides, Singleton}
import common.graphql.UserContext
import common.graphql.schema.{GraphQL, GraphQLSchema}
import common.shapes.ServerModule
import net.codingwell.scalaguice.ScalaModule
import sangria.execution.{Executor, QueryReducer}

import scala.concurrent.ExecutionContext

class SangriaBinding extends ScalaModule {

  @Provides
  @Singleton
  def graphQL(serverModule: ServerModule): GraphQL = {
    new GraphQLSchema(serverModule)
  }

  @Provides
  @Singleton
  def provideSangriaExecutor(graphQL: GraphQL)
                            (implicit executionContext: ExecutionContext): Executor[UserContext, Unit] = {
    Executor(
      schema = graphQL.schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[UserContext](graphQL.maxQueryDepth),
        QueryReducer.rejectComplexQueries[UserContext](graphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
  }
}