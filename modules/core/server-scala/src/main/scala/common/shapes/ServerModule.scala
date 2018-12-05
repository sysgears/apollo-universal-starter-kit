package common.shapes

class ServerModule(modules: Seq[ServerModule] = Seq.empty) extends GraphQLShape
  with SlickSchemaShape
  with AkkaRouteShape {

  //TODO: implement generic fold function
  def fold(): Unit = {
    modules.foreach(m => this.queries ++= m.queries)
    modules.foreach(m => this.mutations ++= m.mutations)
    modules.foreach(m => this.subscriptions ++= m.subscriptions)
    modules.foreach(m => this.slickSchemas ++= m.slickSchemas)
    modules.foreach(m => this.routes ++= m.routes)
  }
}