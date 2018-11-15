package modules.upload.actors

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern._
import com.google.inject.Inject
import modules.upload.actors.FileActor.{GetFilesMetadata, SaveFileMetadata}
import modules.upload.models.FileMetadata
import modules.upload.repositories.FileRepo

import scala.concurrent.ExecutionContext

object FileActor {

  case class SaveFileMetadata(file: FileMetadata, sender: ActorRef)

  case class GetFilesMetadata(sender: ActorRef)

  final val name = "FileActor"
}

class FileActor @Inject()(fileRepo: FileRepo,
                          implicit val executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case saveFileMetadata: SaveFileMetadata =>
      log.info(s"Received a message: [ $saveFileMetadata ]")
      fileRepo.create(saveFileMetadata.file).pipeTo(saveFileMetadata.sender)
    case getFilesMetadata: GetFilesMetadata =>
      log.info(s"Received a message: [ $getFilesMetadata ]")
      fileRepo.findAll.pipeTo(getFilesMetadata.sender)
  }
}