import java.util

import modules.{AkkaModule, ConfigModule, CounterModule}
import net.codingwell.scalaguice.ScalaModule

object InjectionModules {

  def Modules: util.List[ScalaModule] =
    java.util.Arrays.asList(
      new CounterModule,
      new ConfigModule,
      new AkkaModule
    )
}