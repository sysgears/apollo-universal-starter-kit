package modules.jwt.service

import scala.util.Try

trait JwtAuthService[T] {
  def createAccessToken(content: T): String

  def createRefreshToken(content: T, secret: String): String

  def decodeContent(token: String): Try[T]

  def decodeAccessToken(token: String): Try[T]

  def decodeRefreshToken(token: String, secret: String): Try[T]

  def validate(token: String, secret: String): Try[Boolean]
}