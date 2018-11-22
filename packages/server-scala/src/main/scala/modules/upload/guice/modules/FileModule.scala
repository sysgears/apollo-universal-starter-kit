package modules.upload.guice.modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import modules.upload.actors.FileActor
import modules.upload.graphql.resolvers.{FileUploadResolver, FileUploadResolverImpl}
import modules.upload.models.FileMetadata
import modules.upload.repositories.FileMetadataRepository
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.JdbcProfile

class FileModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[FileUploadResolver].to[FileUploadResolverImpl]
    bind[Actor].annotatedWith(Names.named(FileActor.name)).to[FileActor]
  }

  @Provides
  def counterRepository(driver: JdbcProfile): Repository[FileMetadata, Int] = new FileMetadataRepository(driver)

  @Provides
  @Named(FileActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(FileActor)
}