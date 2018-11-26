package actors

import actors.FileActor.SaveFileMetadata
import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern._
import com.google.inject.Inject

import models.FileMetadata
import repositories.FileMetadataRepo

import scala.concurrent.ExecutionContext

object FileActor {

  case class SaveFileMetadata(file: FileMetadata, sender: ActorRef)

  final val name = "FileActor"
}

class FileActor @Inject()(fileRepo: FileMetadataRepo)
                         (implicit val executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case saveFileMetadata: SaveFileMetadata =>
      log.info(s"Received a message: [ $saveFileMetadata ]")
      fileRepo.create(saveFileMetadata.file).pipeTo(saveFileMetadata.sender)
  }
}