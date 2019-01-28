package core.guice.bindings

import net.codingwell.scalaguice.ScalaModule

class CoreBinding extends ScalaModule {
  override def configure(): Unit = {
    install(new ActorBinding)
    install(new AkkaBinding)
    install(new ConfigBinding)
    install(new DbBinding)
    install(new MonixBinding)
    install(new InjectorBinding)
  }
}
