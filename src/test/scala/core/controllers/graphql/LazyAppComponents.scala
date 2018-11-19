package core.controllers.graphql

import modules.upload.repositories.FileRepo
import core.guice.injection.Injecting

trait LazyAppComponents extends Injecting {
  lazy val fileRepo: FileRepo = inject[FileRepo]
}