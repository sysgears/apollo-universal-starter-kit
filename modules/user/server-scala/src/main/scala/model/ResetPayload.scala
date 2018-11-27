package model

import modules.common.FieldError

case class ResetPayload(errors: Option[List[FieldError]] = None)