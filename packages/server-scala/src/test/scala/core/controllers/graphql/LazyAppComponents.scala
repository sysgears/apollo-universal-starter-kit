package core.controllers.graphql

import core.guice.injection.Injecting
import modules.pagination.repositories.DataObjectRepo
import modules.upload.repositories.FileMetadataRepo

trait LazyAppComponents extends Injecting {
  lazy val fileMetadataRepo: FileMetadataRepo = inject[FileMetadataRepo]
  lazy val dataObjectRepo: DataObjectRepo = inject[DataObjectRepo]
}