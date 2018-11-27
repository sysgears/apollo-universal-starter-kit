package repositories

import common.Logger
import common.errors.{InternalServerError, NotFound}
import javax.inject.{Inject, Singleton}
import model.Post
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

trait PostRepo {

  def save(post: Post): Future[Post]

  def find(id: Int): Future[Post]

  def update(post: Post): Future[Post]

  def delete(id: Int): Future[Int]
}

@Singleton
class PostRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends PostRepo with Logger {

  def query = TableQuery[Post.Table]

  override def save(post: Post): Future[Post] = db.run(Actions.save(post))

  override def find(id: Int): Future[Post] = db.run(Actions.find(id))

  override def update(post: Post): Future[Post] = db.run(Actions.update(post))

  override def delete(id: Int): Future[Int] = db.run(Actions.delete(id))

  object Actions {
    def save(post: Post): DBIO[Post] = {
      query returning query.map(_.id) into ((post, id) => post.copy(id = id)) += post
    }

    def find(id: Int): DBIO[Post] =
      for {
        maybePost <- query.filter(_.id === id).result.headOption
        post <- maybePost match {
          case Some(post) =>
            log.info(s"Found post with id [{}]", id)
            DBIO.successful(post)
          case None =>
            log.info(s"Post with id [{}] not found.", id)
            DBIO.failed(NotFound(s"Post with id = $id"))
          case _ =>
            log.error(s"Database error")
            DBIO.failed(InternalServerError(s"Database error"))
        }
      } yield post

    def update(post: Post): DBIO[Post] = {
      for {
        count <- query.filter(_.id === post.id).update(post)
        _ <- count match {
          case 0 => DBIO.failed(NotFound(s"Post with id=$post"))
          case _ => DBIO.successful(())
        }
      } yield post
    }

    def delete(id: Int): DBIO[Int] = query.filter(_.id === id).delete
  }

}