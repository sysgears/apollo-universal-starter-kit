package core.guice.modules

import com.google.inject.Provides
import core.graphql.{GraphQL, UserContext}
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule
import sangria.execution.{Executor, QueryReducer}

import scala.concurrent.ExecutionContext

class SangriaModule extends ScalaModule {

  @Provides
  @Singleton
  def provideSangriaExecutor(implicit executionContext: ExecutionContext): Executor[UserContext, Unit] = {
    Executor(
      schema = GraphQL.schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[UserContext](GraphQL.maxQueryDepth),
        QueryReducer.rejectComplexQueries[UserContext](GraphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
  }
}