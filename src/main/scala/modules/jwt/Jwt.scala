package modules.jwt

import scala.util.Try

trait Jwt {
  def encode(content: String): String

  def decode(token: String): Try[String]

  def validate(token: String): Try[Exception]

  def isValid(token: String): Boolean
}