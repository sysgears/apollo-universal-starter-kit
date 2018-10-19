package services.persistence

import java.io.File

import akka.actor.ActorSystem
import javax.inject.{Inject, Singleton}
import org.iq80.leveldb.util.FileUtils

import scala.util.Try

@Singleton
class PersistenceCleanupImpl @Inject()(actorSystem: ActorSystem) extends PersistenceCleanup {

  val storageLocations: List[File] = List(
    "akka.persistence.journal.leveldb.dir",
    "akka.persistence.journal.leveldb-shared.store.dir",
    "akka.persistence.snapshot-store.local.dir").map { s =>
    new File(actorSystem.settings.config.getString(s))
  }

  override def deleteStorageLocations(){
    storageLocations.foreach(dir => Try(FileUtils.deleteDirectoryContents(dir)))
  }
}