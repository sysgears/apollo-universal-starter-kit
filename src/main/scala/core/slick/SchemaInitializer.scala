package core.slick

import scala.concurrent.Future

abstract class SchemaInitializer {

  def create(): Future[Unit]

  def drop(): Future[Unit]
}