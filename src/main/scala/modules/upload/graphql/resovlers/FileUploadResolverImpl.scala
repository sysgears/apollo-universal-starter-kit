package modules.upload.graphql.resovlers

import java.nio.file.Paths

import akka.actor.ActorRef
import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{FileIO, Source}
import com.google.inject.name.Named
import common.errors._
import common.{ActorUtil, Logger}
import javax.inject.Inject
import modules.upload.actors.FileActor
import modules.upload.actors.FileActor.SaveFileMetadata
import modules.upload.models.FileMetadata
import modules.upload.services.HashAppender

import scala.concurrent.{ExecutionContext, Future}

class FileUploadResolverImpl @Inject()(@Named(FileActor.name) fileActor: ActorRef,
                                       hashAppender: HashAppender)
                                      (implicit executionContext: ExecutionContext,
                                       materializer: ActorMaterializer) extends FileUploadResolver with Logger with ActorUtil {

  override def upload(parts: Source[FormData.BodyPart, Any]): Future[Boolean] = {
    parts.filter(_.filename.nonEmpty).mapAsync(1) {
      part => {
        val hashedFilename = hashAppender.append(part.filename.get)
        part.entity.dataBytes
          .runWith(FileIO.toPath(Paths.get(getClass.getResource("/public").getPath) resolve hashedFilename))
          .map(ioResult => (ioResult, s"public/$hashedFilename"))
      }.map(result =>
        FileMetadata(
          name = part.filename.get,
          contentType = part.entity.contentType.toString,
          size = result._1.count,
          path = result._2
        )
      )
    }.runForeach {
      fileMetadata => sendMessageToActor[FileMetadata](actorRef => fileActor ! SaveFileMetadata(fileMetadata, actorRef))
    }.map(_ => true)
  }.recover {
    case _: Error => false
  }
}