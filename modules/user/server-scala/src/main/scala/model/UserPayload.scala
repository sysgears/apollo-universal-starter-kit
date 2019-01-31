package model

import common.FieldError

case class UserPayload(user: Option[User] = None, errors: Option[List[FieldError]] = None)
