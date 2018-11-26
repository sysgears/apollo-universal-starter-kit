package common.implicits

import scala.concurrent.{ExecutionContext, Future}

object RichFuture {

  /**
    * Adds various extension methods to the Future[Option] class.
    *
    * @param futureOfOption a Future[Option] to be extended
    * @tparam A a type that was lifted to an inner Option of a Future[Option]
    */
  implicit class RichFutureOfOption[A](futureOfOption: Future[Option[A]]) {

    /**
      * Converts this Future[Option] to a Future.failed with the given error, if the inner Option of this Future is
      * not defined (None).
      *
      * @param error an error to be wrapped into a Future.failed
      * @param ec    an execution context for the Future
      * @return a Future.failed with a given error.
      */
    def failOnNone(error: Throwable)(implicit ec: ExecutionContext): Future[A] = futureOfOption.flatMap {
      case Some(value) => Future.successful(value)
      case _ => Future.failed(error)
    }
  }

}