package guice

import com.google.inject.Provides
import common.graphql.UserContext
import common.graphql.schema.GraphQL
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule
import sangria.execution.{Executor, QueryReducer}

import scala.concurrent.ExecutionContext

class SangriaBinding extends ScalaModule {

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