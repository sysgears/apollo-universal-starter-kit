package modules.jwt.service

import com.google.inject.Inject
import modules.jwt.config.JwtConfig
import modules.jwt.decoder.JwtDecoder
import modules.jwt.encoder.JwtEncoder
import modules.jwt.errors.InvalidToken
import modules.jwt.model.{JwtContent, Tokens}
import modules.jwt.validator.JwtValidator
import pdi.jwt.exceptions.JwtExpirationException
import spray.json._

import scala.util.Try

/**
  * Default implementation of JwtAuthService, using default injected JwtEncoder, JwtDecoder, JwtValidator.
  *
  * @param jwtEncoder   JWT encoder
  * @param jwtDecoder   JWT decoder
  * @param jwtValidator JWT validator
  * @param jwtConfig    JWT configs provider
  */
@deprecated
class JwtAuthServiceImpl @Inject()(
    jwtEncoder: JwtEncoder,
    jwtDecoder: JwtDecoder,
    jwtValidator: JwtValidator,
    jwtConfig: JwtConfig
) extends JwtAuthService[JwtContent] {

  /** @inheritdoc */
  override def createAccessToken(content: JwtContent): String =
    jwtEncoder.encode(content.toJson.toString, jwtConfig.secret, jwtConfig.accessTokenExpiration)

  /** @inheritdoc */
  override def createRefreshToken(content: JwtContent, secret: String): String =
    jwtEncoder.encode(content.toJson.toString, jwtConfig.secret + secret, jwtConfig.refreshTokenExpiration)

  /** @inheritdoc */
  def createTokens(content: JwtContent, secret: String): Tokens =
    Tokens(createAccessToken(content), createRefreshToken(content, secret))

  /** @inheritdoc */
  override def decodeContent(token: String): Try[JwtContent] = withExceptionTransform {
    jwtDecoder.decode(token).map(_.parseJson.convertTo[JwtContent])
  }

  /** @inheritdoc */
  override def decodeAccessToken(token: String): Try[JwtContent] = withExceptionTransform {
    jwtDecoder.decode(token, jwtConfig.secret).map(_.parseJson.convertTo[JwtContent])
  }

  /** @inheritdoc */
  override def decodeRefreshToken(token: String, secret: String): Try[JwtContent] = withExceptionTransform {
    jwtDecoder.decode(token, jwtConfig.secret + secret).map(_.parseJson.convertTo[JwtContent])
  }

  /** @inheritdoc */
  override def validate(token: String, secret: String): Try[Boolean] = withExceptionTransform {
    jwtValidator.validate(token, secret)
  }

  private def withExceptionTransform[T](maybeResult: Try[T]): Try[T] = maybeResult.recover {
    case _: JwtExpirationException => throw InvalidToken("Token is expired")
    case _ => throw InvalidToken()
  }
}
