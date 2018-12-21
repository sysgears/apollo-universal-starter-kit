package app

import common.shapes.ServerModule

class GlobalModule(modules: Seq[ServerModule]) extends ServerModule(modules)