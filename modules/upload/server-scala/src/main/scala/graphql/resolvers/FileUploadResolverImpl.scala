package graphql.resolvers

import java.nio.file.{Files, Path, Paths}

import actors.FileActor
import actors.FileActor.SaveFileMetadata
import akka.actor.ActorRef
import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{FileIO, Keep, Sink, Source}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.name.Named
import common.implicits.RichDBIO._
import common.errors._
import common.{ActorMessageDelivering, Logger}
import graphql.resolvers.FileUploadResolverImpl._
import javax.inject.Inject
import models.FileMetadata
import services.HashAppender
import slick.dbio.DBIO

import scala.concurrent.{ExecutionContext, Future}

class FileUploadResolverImpl @Inject()(@Named(FileActor.name) fileActor: ActorRef,
                                       fileRepository: Repository[FileMetadata, Int],
                                       hashAppender: HashAppender)
                                      (implicit executionContext: ExecutionContext,
                                       materializer: ActorMaterializer) extends FileUploadResolver
  with Logger
  with ActorMessageDelivering {

  override def uploadFiles(parts: Source[FormData.BodyPart, Any]): Future[Boolean] = {
    parts.filter(_.filename.nonEmpty).mapAsync(1) {
      part => {
        val hashedFilename = hashAppender.append(part.filename.get)
        if (!publicDirPath.toFile.exists) Files.createDirectory(publicDirPath)
        part.entity.dataBytes
          .runWith(FileIO.toPath(publicDirPath.resolve(hashedFilename)))
          .map {
            ioResult =>
              FileMetadata(
                name = part.filename.get,
                contentType = part.entity.contentType.toString,
                size = ioResult.count,
                path = s"public/$hashedFilename"
              )
          }
      }
    }.mapAsync(1) {
      fileMetadata =>
        sendMessageWithFunc[FileMetadata](actorRef => fileActor ! SaveFileMetadata(fileMetadata, actorRef))
    }.toMat(Sink.ignore)(Keep.right).run.map(_ => true)
  }.recover {
    case error: Error =>
      log.error(s"Failed to upload files. Reason: [$error")
      false
  }

  override def files: Future[List[FileMetadata]] = fileRepository.findAll.run.map(_.toList)

  override def removeFile(id: Int): Future[Boolean] = {
    fileRepository.executeTransactionally(
      for {
        fileMetadataOption <- fileRepository.findOne(id)
        fileMetadata <- if (fileMetadataOption.nonEmpty) DBIO.successful(fileMetadataOption.get) else DBIO.failed(NotFound(s"FileMetadata(id: $id)"))
        deletedFileMetadata <- fileRepository.delete(fileMetadata)
      } yield deletedFileMetadata
    ).run.map {
      deletedFileMetadata =>
        Files.deleteIfExists(resourcesDirPath.resolve(deletedFileMetadata.path))
    }
  }.recover {
    case error: Error =>
      log.error(s"Failed to upload files. Reason: [$error")
      false
  }
}

object FileUploadResolverImpl {
  val resourcesDirPath: Path = Paths.get(getClass.getResource("/").getPath)
  val publicDirPath: Path = resourcesDirPath.resolve("public")
}