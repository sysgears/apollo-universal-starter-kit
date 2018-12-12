package modules.jwt.errors

import common.errors.Error

case class InvalidToken(msg: String = "") extends Error(msg)