package core.controllers.graphql

import core.guice.injection.Injecting
import modules.upload.repositories.FileMetadataRepository

trait LazyAppComponents extends Injecting {
  lazy val fileMetadataRepo: FileMetadataRepository = inject[FileMetadataRepository]
}