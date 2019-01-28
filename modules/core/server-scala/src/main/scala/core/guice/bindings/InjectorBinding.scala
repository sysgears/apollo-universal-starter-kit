package core.guice.bindings

import core.guice.injection.InjectorProvider
import net.codingwell.scalaguice.ScalaModule

class InjectorBinding extends ScalaModule {
  override def configure(): Unit = {
    requestInjection(InjectorProvider)
  }
}
