package controllers.graphql

import java.io.File

import akka.actor.ActorSystem
import org.iq80.leveldb.util.FileUtils

import scala.util.Try

trait PersistenceCleanup {

  def system: ActorSystem

  val storageLocations = List(
    "akka.persistence.journal.leveldb.dir",
    "akka.persistence.journal.leveldb-shared.store.dir",
    "akka.persistence.snapshot-store.local.dir").map { s =>
    new File(system.settings.config.getString(s))
  }

  def deleteStorageLocations {
    storageLocations.foreach(dir => Try(FileUtils.deleteDirectoryContents(dir)))
  }
}