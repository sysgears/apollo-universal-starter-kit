package app

import com.google.inject.{Inject, Singleton}
import common.shapes.ServerModule

@Singleton
class GlobalModule @Inject()(modules: Seq[ServerModule]) extends ServerModule(modules)