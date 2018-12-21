package common.shapes

class ServerModule(modules: Seq[ServerModule] = Seq.empty) extends GraphQLShape
  with SlickSchemaShape
  with AkkaRouteShape {

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