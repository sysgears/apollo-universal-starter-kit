package modules

import actors.FileActor
import akka.actor.{Actor, ActorRef, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule
import repositories.{FileMetadataRepo, FileMetadataRepoImpl}

class FileModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[FileMetadataRepo].to[FileMetadataRepoImpl]
    bind[Actor].annotatedWith(Names.named(FileActor.name)).to[FileActor]
  }

  @Provides
  @Named(FileActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = {
    provideActorRef(FileActor.name)
  }
}
