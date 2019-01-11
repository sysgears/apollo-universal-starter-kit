package core.guice.bindings

import modules.jwt.guice.modules.JwtBinding
import net.codingwell.scalaguice.ScalaModule

class CoreBinding extends ScalaModule {
  override def configure(): Unit = {
    install(new ActorBinding)
    install(new AkkaBinding)
    install(new ConfigBinding)
    install(new DbBinding)
    install(new MonixBinding)
    install(new JwtBinding)
    install(new InjectorBinding)
  }
}
