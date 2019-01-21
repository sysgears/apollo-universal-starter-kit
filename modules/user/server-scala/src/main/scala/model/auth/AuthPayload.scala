package model.auth

import common.FieldError
import jwt.model.Tokens
import model.User

case class AuthPayload(
    user: Option[User] = None,
    tokens: Option[Tokens] = None,
    errors: Option[List[FieldError]] = None
)
