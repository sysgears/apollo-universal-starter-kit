package session.services

import java.security.SecureRandom

import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.headers.HttpCookie
import com.google.inject.Inject
import javax.xml.bind.DatatypeConverter
import session.model.Session

import scala.collection.mutable.ListBuffer

class SessionService @Inject()(cryptoService: CryptoService) {

  def createSession(cookies: ListBuffer[HttpCookie]): String = {
    val randomBytes = new SecureRandom().generateSeed(16)
    val randomBytesHex = DatatypeConverter.printHexBinary(randomBytes)
    writeSession(cookies, Session(csrfToken = randomBytesHex))
  }

  def readSession(headers: List[HttpHeader]): Option[Session] =
    for {
      sessionHeader <- headers.find(_.is("session"))
      session <- cryptoService.decryptSession(sessionHeader.value)
    } yield session

  def writeSession(cookies: ListBuffer[HttpCookie], session: Session): String = {
    val encSession = cryptoService.encryptSession(session)
    val sessionCookie = HttpCookie(
      name = "session",
      value = encSession,
      httpOnly = true,
      maxAge = Some(7 * 24 * 3600),
      path = Some("/")
    )
    val csrfTokenCookie = HttpCookie(
      name = "x-token",
      value = session.csrfToken,
      httpOnly = true,
      maxAge = Some(7 * 24 * 3600),
      path = Some("/")
    )

    cookies ++= sessionCookie :: csrfTokenCookie :: Nil
    encSession
  }
}
