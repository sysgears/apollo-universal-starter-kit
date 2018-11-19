package core.controllers.graphql

import modules.upload.repositories.FileMetadataRepo
import core.guice.injection.Injecting

trait LazyAppComponents extends Injecting {
  lazy val fileMetadataRepo: FileMetadataRepo = inject[FileMetadataRepo]
}