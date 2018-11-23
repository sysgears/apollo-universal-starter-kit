package common

import javax.inject.Inject
import slick.dbio.DBIO
import slick.jdbc.JdbcBackend._

import scala.concurrent.Future

object RichDBIO {

  @Inject
  implicit private var db: Database = _

  implicit class QueryExecutor[T] @Inject()(databaseOperation: DBIO[T]) {
    def run: Future[T] = db.run(databaseOperation)
  }

}