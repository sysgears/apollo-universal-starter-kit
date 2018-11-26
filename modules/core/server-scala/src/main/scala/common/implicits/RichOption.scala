package common.implicits

import scala.concurrent.{ExecutionContext, Future}

object RichOption {

  /**
    * Adds various extension methods to the Option class.
    *
    * @param option a Option to be extended
    * @tparam A a type that was lifted to an inner Option
    */
  implicit class RichOption[A](option: Option[A]) {

    /**
      * Converts this Option to a Future.failed with the given error, if the Option is not defined (None).
      *
      * @param error an error to be wrapped into a Future.failed
      * @param ec    an execution context for the Future
      * @return a Future.failed with a given error.
      */
    def noneAsFutureFail(error: Throwable)(implicit ec: ExecutionContext): Future[A] = option match {
      case Some(value) => Future.successful(value)
      case _ => Future.failed(error)
    }
  }

}