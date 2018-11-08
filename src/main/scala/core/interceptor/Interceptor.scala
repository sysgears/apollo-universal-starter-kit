package core.interceptor

import scala.concurrent.Future

trait Interceptor[Arg, Result] {
  def handle(argument: Arg): Future[Either[Result, Option[Arg]]]
}