package models

import modules.common.FieldError

case class ContactPayload(errors: Option[List[FieldError]] = None)