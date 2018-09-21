import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.google.inject.Guice
import controllers.Routes.Routes
import modules.{AkkaModule, ConfigModule, CountingModule, ExecutionModule}

import scala.concurrent.ExecutionContextExecutor

object Main extends App {

  implicit val system: ActorSystem = ActorSystem("scala-starter-kit")
  implicit val materializer: ActorMaterializer = ActorMaterializer()
  implicit val executionContext: ExecutionContextExecutor = system.dispatcher

  val injector = Guice.createInjector(
    new CountingModule,
    new ConfigModule,
    new AkkaModule,
    new ExecutionModule
  )
  Http().bindAndHandle(Routes, "0.0.0.0")
}