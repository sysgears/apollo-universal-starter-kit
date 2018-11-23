package modules.common

import sangria.validation.ValueCoercionViolation

case object DateCoercionViolation extends ValueCoercionViolation("Date value expected")
