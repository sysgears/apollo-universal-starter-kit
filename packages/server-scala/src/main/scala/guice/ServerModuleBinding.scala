package guice

import app._
import com.google.inject.{Provides, Singleton}
import common.shapes.ServerModule
import core.guice.bindings.{CoreBinding, SangriaBinding}
import net.codingwell.scalaguice.ScalaModule

class ServerModuleBinding extends ScalaModule {

  override def configure(): Unit = {
    install(new ContactBinding)
    install(new CoreBinding)
    install(new CounterBinding)
    install(new MailBinding)
    install(new ItemBinding)
    install(new FileBinding)

    install(new SangriaBinding)
  }

  @Provides
  @Singleton
  def serverModules(contactModule: ContactModule,
                    userModule: UserModule,
                    authenticationModule: AuthenticationModule,
                    uploadModule: UploadModule,
                    paginationModule: PaginationModule,
                    counterModule: CounterModule): ServerModule = {
    new ServerModule(
      Seq(
        contactModule,
        userModule,
        authenticationModule,
        uploadModule,
        paginationModule,
        counterModule
      )
    )
  }
}