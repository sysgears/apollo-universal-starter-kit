package common.graphql.date

import java.text.SimpleDateFormat
import java.util.{Date, TimeZone}

import scala.util.{Failure, Success, Try}

object DateHelper {

  private val timeZoneUTC = TimeZone.getTimeZone("UTC")

  val dateTimeFormat: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:dd'Z'") // ISO 8601 date format
  dateTimeFormat.setTimeZone(timeZoneUTC)

  val dateFormat: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
  dateFormat.setTimeZone(timeZoneUTC)

  val timeFormat: SimpleDateFormat = new SimpleDateFormat("HH:mm:ss'Z'")
  timeFormat.setTimeZone(timeZoneUTC)

  def parseDate(dateStr: String, dateFormat: SimpleDateFormat): Either[DateCoercionViolation.type, Date] =
    Try(dateFormat.parse(dateStr)) match {
      case Success(date) => Right(date)
      case Failure(_) => Left(DateCoercionViolation)
    }
}
