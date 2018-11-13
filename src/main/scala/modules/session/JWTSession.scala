package modules.session

import com.softwaremill.session._
import org.json4s.JValue

trait JWTSession[T] extends Session[T] {
  implicit val serializer: SessionSerializer[T, JValue]
  implicit val encoder: JwtSessionEncoder[T]
}