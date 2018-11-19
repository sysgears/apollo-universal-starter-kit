package modules.mail

import scala.concurrent.Future

trait MailService[M, P] {
  def sent(message: M): Future[P]
}