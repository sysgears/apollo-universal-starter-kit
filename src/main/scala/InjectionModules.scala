import java.util

import modules.{AkkaModule, ConfigModule, CounterModule, SangriaModule}
import net.codingwell.scalaguice.ScalaModule

object InjectionModules {

  def Modules: util.List[ScalaModule] =
    java.util.Arrays.asList(
      new AkkaModule,
      new CounterModule,
      new ConfigModule,
      new SangriaModule
    )
}