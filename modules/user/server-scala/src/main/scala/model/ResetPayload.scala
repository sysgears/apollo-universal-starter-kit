package model

import common.FieldError

case class ResetPayload(errors: Option[List[FieldError]] = None)
