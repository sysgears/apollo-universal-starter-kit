package service

import scala.concurrent.Future

trait MailService[M, P] {
  def send(message: M): Future[P]
}
