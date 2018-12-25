package common.graphql.date

import java.util.Date

import common.graphql.date.DateHelper._
import sangria.marshalling.DateSupport
import sangria.schema.ScalarType

object GraphQLTypes {

  implicit val dateTimeType: ScalarType[Date] = ScalarType[Date](
    name = "DateTime",
    coerceOutput = (date, caps) => {
      if (caps.contains(DateSupport)) date.toString
      else dateTimeFormat.format(date)
    },
    coerceUserInput = {
      case dateStr: String => parseDate(dateStr, dateTimeFormat)
      case _ => Left(DateCoercionViolation)
    },
    coerceInput = {
      case sangria.ast.StringValue(dateStr, _, _, _, _) => parseDate(dateStr, dateTimeFormat)
      case _ => Left(DateCoercionViolation)
    }
  )

  implicit val dateType: ScalarType[Date] = ScalarType[Date](
    name = "Date",
    coerceOutput = (date, caps) => {
      if (caps.contains(DateSupport)) date.toString
      else dateFormat.format(date)
    },
    coerceUserInput = {
      case dateStr: String => parseDate(dateStr, dateFormat)
      case _ => Left(DateCoercionViolation)
    },
    coerceInput = {
      case sangria.ast.StringValue(dateStr, _, _, _, _) => parseDate(dateStr, dateFormat)
      case _ => Left(DateCoercionViolation)
    }
  )

  implicit val timeType: ScalarType[Date] = ScalarType[Date](
    name = "Time",
    coerceOutput = (date, caps) => {
      if (caps.contains(DateSupport)) date.toString
      else timeFormat.format(date)
    },
    coerceUserInput = {
      case dateStr: String => parseDate(dateStr, timeFormat)
      case _ => Left(DateCoercionViolation)
    },
    coerceInput = {
      case sangria.ast.StringValue(dateStr, _, _, _, _) => parseDate(dateStr, timeFormat)
      case _ => Left(DateCoercionViolation)
    }
  )
}
