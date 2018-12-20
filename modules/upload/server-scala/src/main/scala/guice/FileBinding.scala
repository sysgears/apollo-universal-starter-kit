package guice

import actors.FileActor
import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.{FileUploadResolver, FileUploadResolverImpl}
import javax.inject.Named
import models.FileMetadata
import net.codingwell.scalaguice.ScalaModule
import repositories.FileMetadataRepository
import slick.jdbc.JdbcProfile

class FileBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[FileUploadResolver].to[FileUploadResolverImpl]
    bind[Actor].annotatedWith(Names.named(FileActor.name)).to[FileActor]
    install(new HashBinding)
  }

  @Provides
  def fileMetadataRepository(driver: JdbcProfile): Repository[FileMetadata, Int] = new FileMetadataRepository(driver)

  @Provides
  @Named(FileActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(FileActor)
}