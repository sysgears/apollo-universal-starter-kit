package core.interceptor

import scala.concurrent.Future

trait Interceptor[T] {
  def handle(ctx: T): Future[T]
}