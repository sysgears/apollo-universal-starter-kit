package modules.graphql.types

import sangria.validation.ValueCoercionViolation

case object DateCoercionViolation extends ValueCoercionViolation("Date value expected")