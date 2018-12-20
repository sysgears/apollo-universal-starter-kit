package model

import com.byteslounge.slickrepo.meta.Entity
import model.oauth.{CertificateAuth, UserAuth}
import repositories.auth.{FacebookAuthRepository, GithubAuthRepository, GoogleAuthRepository, LinkedinAuthRepository}
import common.implicits.RichDBIO._
import repositories.UserProfileRepository

import scala.concurrent.{ExecutionContext, Future}

case class User(id: Option[Int] = None,
                username: String,
                email: String,
                password: String,
                role: String,
                isActive: Boolean) extends Entity[User, Int] {
  override def withId(id: Int): User = this.copy(id = Some(id))

  def userProfile(userProfileRepository: UserProfileRepository)
                 (implicit executionContext: ExecutionContext): Future[Option[UserProfile]] =
    userProfileRepository.findOne(id.get).run

  def userAuth(serial: Option[String],
               facebookAuthRepo: FacebookAuthRepository,
               googleAuthRepository: GoogleAuthRepository,
               githubAuthRepository: GithubAuthRepository,
               linkedinAuthRepository: LinkedinAuthRepository)
              (implicit executionContext: ExecutionContext): Future[Option[UserAuth]] = for {
    fbAuth <- facebookAuthRepo.findOne(id.get).run
    gAuth <- googleAuthRepository.findOne(id.get).run
    ghAuth <- githubAuthRepository.findOne(id.get).run
    lnAuth <- linkedinAuthRepository.findOne(id.get).run
  } yield (serial, fbAuth, gAuth, ghAuth, lnAuth) match {
    case (None, None, None, None, None) => None
    case _ => Some(UserAuth(Some(CertificateAuth(serial)), fbAuth, gAuth, ghAuth, lnAuth))
  }
}