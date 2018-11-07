package modules.user.repositories

import modules.user.model.User

import scala.concurrent.Future

trait UserRepo {

  def save(user: User): Future[User]

  def find(id: Long): Future[Option[User]]

  def update(user: User): Future[User]

  def delete(id: Long): Future[Int]
}