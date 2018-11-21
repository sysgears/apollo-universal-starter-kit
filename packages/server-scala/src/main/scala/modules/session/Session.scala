package modules.session

import com.softwaremill.session.{InMemoryRefreshTokenStorage, _}

trait Session[T] {
  val sessionConfig: SessionConfig

  implicit val manager: SessionManager[T]
  implicit val refreshTokenStorage: InMemoryRefreshTokenStorage[T]
}