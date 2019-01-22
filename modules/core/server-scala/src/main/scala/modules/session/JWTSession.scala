package modules.session

import com.softwaremill.session._

trait JWTSession[T] extends Session[T] {
  implicit val encoder: JwtSessionEncoder[T]
}
