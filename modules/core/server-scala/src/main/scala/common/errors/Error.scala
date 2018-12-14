package common.errors

import sangria.execution.UserFacingError

class Error(msg: String = "") extends Exception(msg) with UserFacingError