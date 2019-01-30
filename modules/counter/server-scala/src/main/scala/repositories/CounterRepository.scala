package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import models.Counter
import models.CounterTable.CounterTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

class CounterRepository @Inject()(override val driver: JdbcProfile) extends Repository[Counter, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[CounterTable]
  type TableType = CounterTable
}
