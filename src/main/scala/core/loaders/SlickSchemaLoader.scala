package core.loaders

import core.loaders.ModuleLoader.slickSchemaModules

import scala.concurrent.{ExecutionContext, Future}

object SlickSchemaLoader {

  def generateDbSchemas(implicit executionContext: ExecutionContext): Future[List[Unit]] = Future.sequence {
    slickSchemaModules.map(_.create())
  }
}