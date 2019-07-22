package errors

import common.errors.Error

case class Unauthenticated(msg: String = "") extends Error(msg)
