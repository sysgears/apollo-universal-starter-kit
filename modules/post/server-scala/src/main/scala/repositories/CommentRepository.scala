package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.Comment
import model.CommentTable.CommentTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

class CommentRepository @Inject()(override val driver: JdbcProfile) extends Repository[Comment, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[CommentTable]
  type TableType = CommentTable

  def getAllByPostId(postId: Int): DBIO[Seq[Comment]] =
    tableQuery.filter(_.postId === postId).result

}
