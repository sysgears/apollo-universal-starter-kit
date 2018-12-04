package model

import modules.common.FieldError

case class AuthPayload(user: Option[User] = None, tokens: Option[Tokens] = None, errors: Option[List[FieldError]] = None)