package repositories

import common.Logger
import common.errors.{InternalServerError, NotFound}
import javax.inject.{Inject, Singleton}
import model.Comment
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

trait CommentRepo {

  def save(comment: Comment): Future[Comment]

  def find(id: Int): Future[Comment]

  def update(comment: Comment): Future[Comment]

  def delete(id: Int): Future[Int]
}

@Singleton
class CommentRepoImpl @Inject()(db: Database)(implicit executionContext: ExecutionContext) extends CommentRepo with Logger {

  def query = TableQuery[Comment.Table]

  override def save(comment: Comment): Future[Comment] = db.run(Actions.save(comment))

  override def find(id: Int): Future[Comment] = db.run(Actions.find(id))

  override def update(comment: Comment): Future[Comment] = db.run(Actions.update(comment))

  override def delete(id: Int): Future[Int] = db.run(Actions.delete(id))

  object Actions {
    def save(comment: Comment): DBIO[Comment] = {
      query returning query.map(_.id) into ((comment, id) => comment.copy(id = id)) += comment
    }

    def find(id: Int): DBIO[Comment] =
      for {
        maybeComment <- query.filter(_.id === id).result.headOption
        post <- maybeComment match {
          case Some(comment) =>
            log.info(s"Found comment with id [{}]", id)
            DBIO.successful(comment)
          case None =>
            log.info(s"Comment with id [{}] not found.", id)
            DBIO.failed(NotFound(s"Comment with id = $id"))
          case _ =>
            log.error(s"Database error")
            DBIO.failed(InternalServerError(s"Database error"))
        }
      } yield post

    def update(comment: Comment): DBIO[Comment] = {
      for {
        count <- query.filter(_.id === comment.id).update(comment)
        _ <- count match {
          case 0 => DBIO.failed(NotFound(s"Comment with id=$comment"))
          case _ => DBIO.successful(())
        }
      } yield comment
    }

    def delete(id: Int): DBIO[Int] = query.filter(_.id === id).delete
  }

}
