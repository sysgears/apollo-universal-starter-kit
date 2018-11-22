package modules.upload.repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import modules.upload.models.FileMetadata
import modules.upload.models.FileMetadataTable.FileMetadataTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

class FileMetadataRepository @Inject()(override val driver: JdbcProfile) extends Repository[FileMetadata, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[FileMetadataTable]
  type TableType = FileMetadataTable
}