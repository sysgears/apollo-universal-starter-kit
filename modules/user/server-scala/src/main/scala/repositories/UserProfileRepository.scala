package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.UserProfile
import model.UserProfileTable.UserProfileTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class UserProfileRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[UserProfile, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[UserProfileTable]
  type TableType = UserProfileTable
}
