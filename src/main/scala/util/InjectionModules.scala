package util

import java.util

import modules._
import net.codingwell.scalaguice.ScalaModule

object InjectionModules {

  def modules: util.List[ScalaModule] =
    java.util.Arrays.asList(
      new AkkaModule,
      new CounterModule,
      new ConfigModule,
      new SangriaModule,
      new MonixModule,
      new PublisherModule
    )
}