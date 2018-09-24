import akka.actor.ActorSystem
import modules.{AkkaModule, ConfigModule, CounterModule, ExecutionModule}
import scala.collection.JavaConverters._

object InjectionModules {

  def Modules(implicit actorSystem: ActorSystem) = Iterable(
    new CounterModule,
    new ConfigModule,
    new AkkaModule,
    new ExecutionModule
  ).asJava
}
