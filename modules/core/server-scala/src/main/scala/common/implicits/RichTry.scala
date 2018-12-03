package common.implicits

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

object RichTry {

  /**
    * Adds various extension methods to the Future[Option] class.
    *
    * @param tryVal a Try to be extended
    * @tparam A a type that was lifted to an inner Try
    */
  implicit class RichTry[A](tryVal: Try[A]) {

    /**
      * Converts this Try to a Future.failed with the given error, if the Try contains error (Try.failed).
      *
      * @param ec an execution context for the Future
      * @return a Future.failed with a errorHandler output type error.
      */
    def asFuture(implicit ec: ExecutionContext): Future[A] = tryVal match {
      case Success(value) => Future.successful(value)
      case Failure(exception) => Future.failed(exception)
    }
  }

}