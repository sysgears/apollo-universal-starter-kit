package guice

import core.guice.bindings.CoreBinding
import net.codingwell.scalaguice.ScalaModule

class GlobalBinding extends ScalaModule {
  override def configure(): Unit = {
    install(new ContactBinding)
    install(new CoreBinding)
    install(new CounterBinding)
    install(new MailBinding)
    install(new ItemBinding)
    install(new UserBinding)
    install(new FileBinding)
    install(new SangriaBinding)
    install(new ServerModulesBinding)
    install(new AuthenticationBinding)
  }
}