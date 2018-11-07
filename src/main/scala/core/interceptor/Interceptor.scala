package core.interceptor

import scala.concurrent.Future

trait Interceptor[A, B] {
  def handle(ctx: A): Future[Either[B, Option[A]]]
}