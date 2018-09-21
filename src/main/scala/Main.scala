import com.google.inject.Guice
import modules.{AkkaModule, ConfigModule, CountingModule, ExecutionModule}

object Main extends App {

  val injector = Guice.createInjector(
    new CountingModule,
    new ConfigModule,
    new AkkaModule,
    new ExecutionModule
  )
}