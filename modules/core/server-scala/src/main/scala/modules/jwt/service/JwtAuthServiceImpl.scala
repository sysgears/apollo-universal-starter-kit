package modules.jwt.service

import com.google.inject.Inject
import modules.jwt.config.JwtConfig
import modules.jwt.decoder.JwtDecoder
import modules.jwt.encoder.JwtEncoder
import modules.jwt.model.JwtContent
import spray.json._

import scala.util.Try

class JwtAuthServiceImpl @Inject()(jwtEncoder: JwtEncoder,
                                   jwtDecoder: JwtDecoder,
                                   jwtConfig: JwtConfig) extends JwtAuthService[JwtContent] {

  override def createAccessToken(content: JwtContent): String =
    jwtEncoder.encode(content.toJson.toString, jwtConfig.secret, jwtConfig.accessTokenExpiration)

  override def createRefreshToken(content: JwtContent, secret: String): String =
    jwtEncoder.encode(content.toJson.toString, jwtConfig.secret + secret, jwtConfig.refreshTokenExpiration)

  override def decodeContent(token: String): Try[JwtContent] =
    jwtDecoder.decode(token).map(_.parseJson.convertTo[JwtContent])

  override def decodeAccessToken(token: String): Try[JwtContent] =
    jwtDecoder.decode(token, jwtConfig.secret).map(_.parseJson.convertTo[JwtContent])

  override def decodeRefreshToken(token: String, secret: String): Try[JwtContent] =
    jwtDecoder.decode(token, jwtConfig.secret + secret).map(_.parseJson.convertTo[JwtContent])
}