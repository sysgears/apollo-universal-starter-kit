package core.app

import common.shapes.ServerModule
import core.guice.bindings.CoreBinding

class CoreModule extends ServerModule {
  bindings = new CoreBinding
}