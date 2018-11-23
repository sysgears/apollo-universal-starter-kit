package core.slick

import scala.concurrent.Future

trait SchemaInitializer {

  def create(): Future[Unit]

  def drop(): Future[Unit]
}