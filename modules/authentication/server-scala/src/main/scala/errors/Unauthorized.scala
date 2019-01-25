package errors

import common.errors.Error

case class Unauthorized(msg: String = "") extends Error(msg)
