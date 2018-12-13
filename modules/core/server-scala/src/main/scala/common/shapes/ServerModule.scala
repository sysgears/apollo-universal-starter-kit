package common.shapes

class ServerModule(modules: Seq[ServerModule] = Seq.empty) extends GraphQLShape
  with SlickSchemaShape
  with AkkaRouteShape {

  //TODO: implement generic fold function
  def fold: ServerModule = {
    val m = modules
    m.foldLeft(this.queries)((queries, module) => queries ++= module.queries)
    m.foldLeft(this.mutations)((mutations, module) => mutations ++= module.mutations)
    m.foldLeft(this.subscriptions)((subscriptions, module) => subscriptions ++= module.subscriptions)
    m.foldLeft(this.slickSchemas)((slickSchemas, module) => slickSchemas ++= module.slickSchemas)
    m.foldLeft(this.routes)((routes, module) => routes ++= module.routes)
    this
  }
}