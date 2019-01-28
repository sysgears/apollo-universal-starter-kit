package actors

import actors.FileActor.SaveFileMetadata
import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern._
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.ActorNamed
import common.implicits.RichDBIO._
import models.FileMetadata

import scala.concurrent.ExecutionContext

object FileActor extends ActorNamed {

  case class SaveFileMetadata(file: FileMetadata, sender: ActorRef)

  final val name = "FileActor"
}

class FileActor @Inject()(fileMetadataRepository: Repository[FileMetadata, Int])(
    implicit val executionContext: ExecutionContext
) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case saveFileMetadata: SaveFileMetadata =>
      log.info(s"Received a message: [ $saveFileMetadata ]")
      fileMetadataRepository.save(saveFileMetadata.file).run.pipeTo(saveFileMetadata.sender)
  }
}
