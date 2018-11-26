package modules.mail.config

import com.google.inject.Inject
import com.typesafe.config.Config

class MailConfig @Inject()(config: Config) {
  val address: String = config.getString("email.address")
}