package graphql.resolvers

import java.sql.SQLException

import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import common.implicits.RichTry._
import com.github.jurajburian.mailer.Message
import com.google.inject.Inject
import common.FieldError
import common.config.AppConfig
import common.errors.{AlreadyExists, NotFound}
import org.mindrot.jbcrypt.BCrypt
import repositories.{UserProfileRepository, UserRepository}
import config.{AuthConfig, MailConfig}
import errors.Unauthenticated
import jwt.model.{JwtContent, Tokens}
import jwt.service.JwtAuthService
import model._
import model.auth.AuthPayload
import model.facebook.FacebookAuth
import model.github.GithubAuth
import model.google.GoogleAuth
import model.linkedin.LinkedinAuth
import models.MailPayload
import repositories.auth._
import services.{MailService, MessageTemplateService}

import scala.concurrent.{ExecutionContext, Future}

class UserResolver @Inject()(
    userRepository: UserRepository,
    userProfileRepository: UserProfileRepository,
    facebookAuthRepo: FacebookAuthRepository,
    googleAuthRepository: GoogleAuthRepository,
    githubAuthRepository: GithubAuthRepository,
    linkedinAuthRepository: LinkedinAuthRepository,
    certificateAuthRepository: CertificateAuthRepository,
    jwtAuthService: JwtAuthService[JwtContent],
    mailService: MailService[Message, MailPayload],
    messageTemplateService: MessageTemplateService,
    mailConfig: MailConfig,
    authConfig: AuthConfig,
    appConfig: AppConfig
)(
    implicit executionContext: ExecutionContext
) {

  def addUser(input: AddUserInput): Future[UserPayload] =
    for {
      user <- userRepository.save {
        User(
          username = input.username,
          email = input.email,
          password = BCrypt.hashpw(input.password, BCrypt.gensalt),
          role = input.role,
          isActive = input.isActive.getOrElse(false)
        )
      }.run
      _ <- input.profile.fold(Future.successful(UserProfile())) {
        profile =>
          userProfileRepository.save {
            UserProfile(
              id = user.id,
              firstName = profile.firstName,
              lastName = profile.lastName,
              fullName = profile.firstName.flatMap(firstName => profile.lastName.map(firstName + _))
            )
          }.run
      }
      _ <- input.auth.fold(Future.successful()) {
        auth =>
          for {
            _ <- auth.facebook.fold(Future.successful[Any]())(
              input => facebookAuthRepo.save(FacebookAuth(input.fbId, input.displayName.getOrElse(""), user.id.get)).run
            )
            _ <- auth.github.fold(Future.successful[Any]())(
              input =>
                githubAuthRepository
                  .save(GithubAuth(input.ghId.map(_.toInt), input.displayName.getOrElse(""), user.id.get))
                  .run
            )
            _ <- auth.google.fold(Future.successful[Any]())(
              input =>
                googleAuthRepository.save(GoogleAuth(input.googleId, input.displayName.getOrElse(""), user.id.get)).run
            )
            _ <- auth.linkedin.fold(Future.successful[Any]())(
              input =>
                linkedinAuthRepository.save(LinkedinAuth(input.lnId, input.displayName.getOrElse(""), user.id.get)).run
            )
            _ <- auth.certificate.fold(Future.successful[Any]())(
              input => certificateAuthRepository.save(CertificateAuth(user.id, serial = input.serial)).run
            )
          } yield ()
      }
    } yield UserPayload(user = Some(user))

  def editUser(input: EditUserInput): Future[UserPayload] =
    for {
      user <- userRepository.findOne(input.id).run failOnNone NotFound(s"User with id = ${input.id}")
      editedUser <- userRepository.update {
        User(
          id = Some(input.id),
          username = input.username,
          email = input.email,
          password = input.password.map(BCrypt.hashpw(_, BCrypt.gensalt)).getOrElse(user.password),
          role = input.role,
          isActive = input.isActive.getOrElse(user.isActive)
        )
      }.run
      _ <- input.profile.fold(Future.successful(UserProfile())) {
        profile =>
          userProfileRepository.update {
            UserProfile(
              id = Some(input.id),
              firstName = profile.firstName,
              lastName = profile.lastName,
              fullName = profile.firstName.flatMap(firstName => profile.lastName.map(firstName + _))
            )
          }.run
      }
      _ <- input.auth.fold(Future.successful()) {
        auth =>
          for {
            _ <- auth.facebook.fold(Future.successful[Any]())(
              input =>
                facebookAuthRepo.update(FacebookAuth(input.fbId, input.displayName.getOrElse(""), user.id.get)).run
            )
            _ <- auth.github.fold(Future.successful[Any]())(
              input =>
                githubAuthRepository
                  .update(GithubAuth(input.ghId.map(_.toInt), input.displayName.getOrElse(""), user.id.get))
                  .run
            )
            _ <- auth.google.fold(Future.successful[Any]())(
              input =>
                googleAuthRepository
                  .update(GoogleAuth(input.googleId, input.displayName.getOrElse(""), user.id.get))
                  .run
            )
            _ <- auth.linkedin.fold(Future.successful[Any]())(
              input =>
                linkedinAuthRepository
                  .update(LinkedinAuth(input.lnId, input.displayName.getOrElse(""), user.id.get))
                  .run
            )
            _ <- auth.certificate.fold(Future.successful[Any]())(
              input => certificateAuthRepository.update(CertificateAuth(user.id, serial = input.serial)).run
            )
          } yield ()
      }
    } yield UserPayload(user = Some(editedUser))

  def deleteUser(id: Int): Future[UserPayload] =
    for {
      user <- userRepository.findOne(id).run failOnNone NotFound(s"User with id = $id")
      deletedUser <- userRepository.delete(user).run
    } yield UserPayload(user = Some(deletedUser))

  def users(orderBy: Option[OrderByUserInput], filter: Option[FilterUserInput]): Future[List[User]] = {
    userRepository.findAll(orderBy, filter).run.map(_.toList)
  }

  def user(id: Int): Future[UserPayload] = userRepository.findOne(id).run.map(user => UserPayload(user))

  def register(input: RegisterUserInput, skipConfirmation: Boolean): Future[UserPayload] = {
    for {
      createdUser <- userRepository
        .save(
          User(
            username = input.username,
            email = input.email,
            role = "user",
            isActive = skipConfirmation,
            password = BCrypt.hashpw(input.password, BCrypt.gensalt)
          )
        )
        .run
      mailingResult <- if (!skipConfirmation) {
        mailService.send(
          messageTemplateService.createConfirmRegistrationMessage(
            createdUser,
            appConfig.name,
            mailConfig.address,
            appConfig.url + "/confirmation/" + jwtAuthService.createAccessToken(JwtContent(createdUser.id.get))
          )
        )
      } else Future.successful(MailPayload())
    } yield UserPayload(Some(createdUser), mailingResult.errors)
  }.recover {
    case e: SQLException =>
      val usernameWarning =
        if (e.getMessage.contains("column USERNAME is not unique"))
          Some(FieldError("username", "Username already exists."))
        else None
      val emailWarning =
        if (e.getMessage.contains("column EMAIL is not unique")) Some(FieldError("email", "E-mail already exists."))
        else None
      UserPayload(errors = Some(List(usernameWarning, emailWarning).flatten))
  }

  def resendConfirmationMesage(input: ResendConfirmationMessageInput): Future[UserPayload] =
    for {
      user <- userRepository.findByUsernameOrEmail(input.usernameOrEmail).run failOnNone NotFound(
        s"User with username or email: [${input.usernameOrEmail}] not found."
      )
      _ <- if (!user.isActive) Future.successful()
      else Future.failed(AlreadyExists(s"User with id: [${user.id}] is active"))
      _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful()
      else Future.failed(Unauthenticated())
      accessToken = jwtAuthService.createAccessToken(JwtContent(user.id.get))
      mailingResult <- mailService.send(
        messageTemplateService.createConfirmRegistrationMessage(
          user,
          appConfig.name,
          mailConfig.address,
          appConfig.url + "/confirmation/" + accessToken
        )
      )
    } yield UserPayload(Some(user), mailingResult.errors)

  def login(input: LoginUserInput): Future[AuthPayload] = {
    for {
      user <- userRepository.findByUsernameOrEmail(input.usernameOrEmail).run failOnNone NotFound(
        s"User with username or email: [${input.usernameOrEmail}] not found."
      )
      _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful()
      else Future.failed(Unauthenticated())
      accessToken = jwtAuthService.createAccessToken(JwtContent(user.id.get))
      refreshToken = jwtAuthService.createRefreshToken(JwtContent(user.id.get), user.password)
    } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
  }.recover {
    case _: NotFound =>
      AuthPayload(errors = Some(FieldError("usernameOrEmail", "Please enter a valid username or e-mail.") :: Nil))
    case _: Unauthenticated =>
      AuthPayload(errors = Some(FieldError("password", "Please enter a valid password.") :: Nil))
  }

  def forgotPassword(input: ForgotPasswordInput): Future[String] =
    for {
      user <- userRepository.findByEmail(input.email).run failOnNone NotFound(
        s"User with username or email: [${input.email}] not found."
      )
      token = jwtAuthService.createAccessToken(JwtContent(user.id.get))
      _ <- mailService.send(
        messageTemplateService.createRecoverPasswordMessage(
          user,
          appConfig.name,
          mailConfig.address,
          appConfig.url + "/reset-password/" + token
        )
      )
    } yield token

  def resetPassword(input: ResetPasswordInput): Future[ResetPayload] = {
    if (input.password != input.passwordConfirmation)
      Future.successful(ResetPayload(Some(FieldError("password", "Passwords are not the same.") :: Nil)))
    else if (input.password.length < authConfig.passwordMinLength)
      Future.successful(
        ResetPayload(
          Some(FieldError("password", s"Password length must be more than ${authConfig.passwordMinLength}.") :: Nil)
        )
      )
    else
      for {
        tokenContent <- jwtAuthService.decodeAccessToken(input.token).asFuture
        user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(
          s"User with id: [${tokenContent.id}] not found."
        )
        _ <- userRepository.update(user.copy(password = BCrypt.hashpw(input.password, BCrypt.gensalt))).run
      } yield ResetPayload()
  }
}
