package errors

import common.errors.Error

case class Forbidden(msg: String = "") extends Error(msg)
