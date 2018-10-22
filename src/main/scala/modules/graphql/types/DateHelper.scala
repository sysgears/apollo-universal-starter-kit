package modules.graphql.types

import java.text.SimpleDateFormat
import java.util.Date

import scala.util.{Failure, Success, Try}

object DateHelper {
  def parseDate(dateStr: String, dateFormat: SimpleDateFormat): Either[DateCoercionViolation.type, Date] =
    Try(dateFormat.parse(dateStr)) match {
      case Success(date) => Right(date)
      case Failure(_) => Left(DateCoercionViolation)
    }
}