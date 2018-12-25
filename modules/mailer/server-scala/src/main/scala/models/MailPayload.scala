package models

import common.FieldError

case class MailPayload(errors: Option[List[FieldError]] = None)
