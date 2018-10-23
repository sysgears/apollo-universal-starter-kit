package modules.contact.models

import modules.common.FieldError

case class ContactPayload(errors: Option[FieldError] = None)