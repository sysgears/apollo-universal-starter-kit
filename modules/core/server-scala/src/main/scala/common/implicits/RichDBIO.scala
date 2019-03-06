package common.implicits

import javax.inject.Inject
import slick.dbio.DBIO
import slick.jdbc.JdbcBackend.Database

import scala.concurrent.Future
import scala.language.implicitConversions

object RichDBIO {

  @Inject
  implicit private var db: Database = _

  implicit class QueryExecutor[T] @Inject()(databaseOperation: DBIO[T]) {
    def run: Future[T] = db.run(databaseOperation)
  }

}
