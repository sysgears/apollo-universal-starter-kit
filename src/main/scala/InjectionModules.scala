import akka.actor.ActorSystem
import modules.{AkkaModule, ConfigModule, CounterModule, ExecutionModule}

object InjectionModules {

  def Modules(implicit actorSystem: ActorSystem) =
    java.util.Arrays.asList(
      new CounterModule,
      new ConfigModule,
      new AkkaModule,
      new ExecutionModule
    )
}
