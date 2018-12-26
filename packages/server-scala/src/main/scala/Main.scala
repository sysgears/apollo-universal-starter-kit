import com.google.inject.Guice
import common.shapes.ServerModule
import core.app.ModuleApp
import core.guice.injection.InjectorProvider.inject
import guice.ServerModuleBinding

object Main extends ModuleApp {
  Guice.createInjector(new ServerModuleBinding)
  createApp(inject[ServerModule])
}