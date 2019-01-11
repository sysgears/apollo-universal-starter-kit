import session.model.Session
import session.services.CryptoService

class CryptoServiceSpec extends AuthenticationTestHelper {

  val cryptoService: CryptoService = inject[CryptoService]

  "CryptoService" must {
    "encrypt and decrypt session data correctly" in {
      val session = Session(userId = Some(43), csrfToken = "token")
      val encSession = cryptoService.encryptSession(session)
      val decSession = cryptoService.decryptSession(encSession)

      decSession.get shouldBe session
    }
  }
}
