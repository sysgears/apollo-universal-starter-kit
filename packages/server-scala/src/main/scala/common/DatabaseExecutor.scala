package common

import javax.inject.Inject
import slick.dbio.DBIO
import slick.jdbc.JdbcBackend._

import scala.concurrent.Future

object DatabaseExecutor {

  @Inject
  implicit private var db: Database = _

  implicit class DatabaseRunner[T] @Inject()(databaseOperation: DBIO[T]) {
    def toFuture: Future[T] = db.run(databaseOperation)
  }

}