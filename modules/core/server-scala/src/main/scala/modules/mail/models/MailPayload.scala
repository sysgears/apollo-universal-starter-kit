package modules.mail.models

import modules.common.FieldError

case class MailPayload(errors: Option[List[FieldError]] = None)
