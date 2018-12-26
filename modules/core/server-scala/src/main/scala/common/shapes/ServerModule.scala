package common.shapes

import com.google.inject.util.Modules.combine

class ServerModule(modules: Seq[ServerModule] = Seq.empty) extends GraphQLShape
  with SlickSchemaShape
  with AkkaRouteShape
  with GuiceBindingShape {

  def foldBindings: ServerModule = {
    bindings = modules.foldLeft(this.bindings)((bindings, module) => combine(bindings, module.bindings))
    this
  }

  //TODO: implement generic fold function
  def fold: ServerModule = {
    modules.foldLeft(this.queries)((queries, module) => queries ++= module.queries)
    modules.foldLeft(this.mutations)((mutations, module) => mutations ++= module.mutations)
    modules.foldLeft(this.subscriptions)((subscriptions, module) => subscriptions ++= module.subscriptions)
    modules.foldLeft(this.extensions)((extensions, module) => extensions ++= module.extensions)
    modules.foldLeft(this.slickSchemas)((slickSchemas, module) => slickSchemas ++= module.slickSchemas)
    modules.foldLeft(this.routes)((routes, module) => routes ++= module.routes)
    this
  }
}