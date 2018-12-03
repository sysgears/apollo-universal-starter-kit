import akka.actor.ActorRef
import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.HttpHeader.ParsingResult.Ok
import common.ActorMessageDelivering
import common.errors.NotFound
import core.guice.injection.GuiceActorRefProvider
import graphql.interceptors.UserInterceptor
import graphql.interceptors.UserInterceptor.GetUserByHeadersMessage
import graphql.resolvers.UserResolver
import model.{RegisterUserInput, User, UserPayload}
import modules.jwt.errors.InvalidToken
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository

class UserInterceptorSpec extends TestHelper
  with ActorMessageDelivering
  with GuiceActorRefProvider {

  val userResolver: ActorRef = provideActorRef(UserResolver)
  val userInterceptor: ActorRef = provideActorRef(UserInterceptor)
  val userRepo: UserRepository = inject[UserRepository]
  val authService: JwtAuthService[JwtContent] = inject[JwtAuthService[JwtContent]]

  val testEmail = "scala-test@gmail.com"
  val testPassword = "12345678q"
  val testUsername = "testName"

  "UserInterceptor" must {
    "return user by jwt stored in headers" in {
      val user: User = await(
        sendMessageToActor[UserPayload](userResolver, (RegisterUserInput(testUsername, testEmail, testPassword), true))
      ).user.get
      val jwt = authService.createAccessToken(JwtContent(user.id.get))
      val header = HttpHeader.parse("x-token", s"$jwt") match {
        case Ok(h, _) => Some(h)
        case _ => None
      }
      val interceptedUser: User = await(sendMessageToActor[Option[User]](userInterceptor, GetUserByHeadersMessage(List(header.get)))).get

      interceptedUser shouldBe user
    }

    "return None if user was not found" in {
      val jwt = authService.createAccessToken(JwtContent(1))
      val header = HttpHeader.parse("x-token", s"$jwt") match {
        case Ok(h, _) => Some(h)
        case _ => None
      }
      val interceptedUser: Option[User] = await(sendMessageToActor[Option[User]](userInterceptor, GetUserByHeadersMessage(List(header.get))))

      interceptedUser shouldBe None
    }

    "return NotFound if jwt does not stored in headers" in {
      val header = HttpHeader.parse("foo", "bar") match {
        case Ok(h, _) => Some(h)
        case _ => None
      }
      val error = await(sendMessageToActor[Option[User]](userInterceptor, GetUserByHeadersMessage(List(header.get))).failed)

      error shouldBe NotFound("Token not found")
    }

    "return InvalidToken if jwt is invalid" in {
      val jwt = authService.createAccessToken(JwtContent(1))
      val corruptedJwt = jwt.concat("9").drop(2)
      val header = HttpHeader.parse("x-token", s"$corruptedJwt") match {
        case Ok(h, _) => Some(h)
        case _ => None
      }
      val error = await(sendMessageToActor[Option[User]](userInterceptor, GetUserByHeadersMessage(List(header.get))).failed)

      error shouldBe InvalidToken()
    }
  }
}