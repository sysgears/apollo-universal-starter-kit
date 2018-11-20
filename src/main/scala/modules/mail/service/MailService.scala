package modules.mail.service

import scala.concurrent.Future

trait MailService[M, P] {
  def sent(message: M): Future[P]
}
