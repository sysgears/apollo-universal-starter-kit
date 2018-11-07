package modules.user.model

import modules.common.FieldError

case class UserPayload(user: Option[User] = None, errors: List[FieldError] = Nil)