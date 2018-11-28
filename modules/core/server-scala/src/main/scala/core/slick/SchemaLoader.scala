package core.slick

import scala.concurrent.Future

trait SchemaLoader {

  def create(): Future[Unit]

  def drop(): Future[Unit]
}