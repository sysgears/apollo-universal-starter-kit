package core.guice.modules

import com.google.inject.{AbstractModule, Provides}
import core.graphql.GraphQL
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule
import sangria.execution.batch.BatchExecutor
import sangria.execution.{Executor, QueryReducer}

import scala.concurrent.ExecutionContext

class SangriaModule extends AbstractModule with ScalaModule {

  @Provides
  @Singleton
  def provideSangriaExecutor(implicit executionContext: ExecutionContext): Executor[Unit, Unit] = {
    Executor(
      schema = GraphQL.schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[Unit](GraphQL.maxQueryDepth),
        QueryReducer.rejectComplexQueries[Unit](GraphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
  }

  @Provides
  @Singleton
  def provideSangriaBatchExecutor(implicit executionContext: ExecutionContext): BatchExecutor.type = {
    BatchExecutor
  }
}