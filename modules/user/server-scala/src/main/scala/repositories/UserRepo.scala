package repositories

import common.errors.{AmbigousResult, NotFound}
import javax.inject.{Inject, Singleton}
import model.User
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

trait UserRepo {

  def save(user: User): Future[User]

  def find(id: Int): Future[Option[User]]

  def find(usernameOrEmail: String): Future[Option[User]]

  def update(user: User): Future[User]

  def delete(id: Int): Future[Int]
}

@Singleton
class UserRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends UserRepo {

  def query = TableQuery[User.Table]

  override def save(user: User): Future[User] = db.run(Actions.save(user))

  override def find(id: Int): Future[Option[User]] = db.run(Actions.find(id))

  override def find(usernameOrEmail: String): Future[Option[User]] = db.run(Actions.find(usernameOrEmail))

  override def update(user: User): Future[User] = db.run(Actions.update(user))

  override def delete(id: Int): Future[Int] = db.run(Actions.delete(id))

  object Actions {
    def save(user: User): DBIO[User] = {
      query returning query.map(_.id) into ((user, id) => user.copy(id = Some(id))) += user
    }

    def find(id: Int): DBIO[Option[User]] = for {
      users <- query.filter(_.id === id).result
      user <- if (users.lengthCompare(2) < 0) DBIO.successful(users.headOption) else DBIO.failed(AmbigousResult(s"User with id = $id"))
    } yield user

    def find(usernameOrEmail: String): DBIO[Option[User]] = for {
      users <- query.filter(user => user.email === usernameOrEmail || user.username === usernameOrEmail).result
      user <- if (users.lengthCompare(2) < 0) DBIO.successful(users.headOption) else DBIO.failed(AmbigousResult(s"User with username or email = $usernameOrEmail"))
    } yield user

    def update(user: User): DBIO[User] = {
      for {
        count <- query.filter(_.id === user.id).update(user)
        _ <- count match {
          case 0 => DBIO.failed(NotFound(s"User with id = $user"))
          case _ => DBIO.successful(())
        }
      } yield user
    }

    def delete(id: Int): DBIO[Int] = query.filter(_.id === id).delete
  }

}