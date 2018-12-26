package common.graphql.date

import sangria.validation.ValueCoercionViolation

case object DateCoercionViolation extends ValueCoercionViolation("Date value expected")
