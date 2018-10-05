package modules

import com.google.inject.{AbstractModule, Provides}
import graphql.{GraphQL, GraphQLContext}
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule
import sangria.execution.batch.BatchExecutor
import sangria.execution.{Executor, QueryReducer}

import scala.concurrent.ExecutionContext

class SangriaModule extends AbstractModule with ScalaModule {

  @Provides
  @Singleton
  def provideSangriaExecutor(implicit executionContext: ExecutionContext): Executor[GraphQLContext, Unit] = {
    Executor(
      schema = GraphQL.Schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[GraphQLContext](GraphQL.maxQueryDepth),
        QueryReducer.rejectComplexQueries[GraphQLContext](GraphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
  }

  @Provides
  @Singleton
  def provideSangriaBatchExecutor(implicit executionContext: ExecutionContext): BatchExecutor.type = {
    BatchExecutor
  }
}