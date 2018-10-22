package modules.graphql.types

import java.text.SimpleDateFormat
import java.util.{Date, TimeZone}

import modules.graphql.types.DateHelper.parseDate
import sangria.marshalling.DateSupport
import sangria.schema.ScalarType

object GraphQLTypes {

  private val dateTimeFormat: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:dd'Z'") // ISO 8601 date format

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

  private val dateFormat: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")

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

  private val timeFormat: SimpleDateFormat = new SimpleDateFormat("HH:mm:ss'Z'")

  timeFormat.setTimeZone(TimeZone.getTimeZone("UTC"))

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