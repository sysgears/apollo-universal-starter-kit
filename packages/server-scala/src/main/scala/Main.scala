import app._
import common.graphql.UserContext
import common.slick.SchemaInitializer
import core.app.{CoreModule, ModuleApp}
import shapes.ServerModule

object Main extends ModuleApp {

  val serverModule: ServerModule[UserContext, SchemaInitializer[_]] = new ServerModule[UserContext, SchemaInitializer[_]](
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