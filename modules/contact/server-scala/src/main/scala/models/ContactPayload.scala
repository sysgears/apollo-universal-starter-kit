package models

import common.FieldError

case class ContactPayload(errors: Option[List[FieldError]] = None)
