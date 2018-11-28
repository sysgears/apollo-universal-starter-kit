package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.Post
import model.PostTable.PostTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

class PostRepository @Inject()(override val driver: JdbcProfile) extends Repository[Post, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[PostTable]
  type TableType = PostTable
}
