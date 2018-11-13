package modules.upload.guice.modules

import modules.upload.graphql.resovlers.{FileUploadResolver, FileUploadResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ResolverModule extends ScalaModule {

  override def configure() {
    bind[FileUploadResolver].to[FileUploadResolverImpl]
  }
}