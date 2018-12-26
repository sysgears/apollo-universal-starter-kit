import app._
import common.shapes.ServerModule
import core.app.{CoreModule, ModuleApp}

object Main extends ModuleApp {

  val serverModule = new ServerModule(
    Seq(
      new CounterModule,
      new CoreModule,
      new MailModule,
      new ContactModule,
      new UserModule,
      new AuthenticationModule,
      new UploadModule,
      new PaginationModule
    )
  )
  createApp(serverModule)
}