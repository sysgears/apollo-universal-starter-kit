package shapes

import com.google.inject.util.Modules.combine
import shapes.graphql.GraphQLShape
import shapes.slick.SlickSchemaShape

class ServerModule[Ctx, SchemaInitializer](modules: Seq[ServerModule[Ctx, SchemaInitializer]] = Seq.empty)
  extends GraphQLShape[Ctx, Unit]
  with SlickSchemaShape[SchemaInitializer]
  with AkkaRouteShape
  with GuiceBindingShape {

  def foldBindings: ServerModule[Ctx, SchemaInitializer] = {
    bindings = modules.foldLeft(this.bindings)((bindings, module) => combine(bindings, module.bindings))
    this
  }

  //TODO: implement generic fold function
  def fold: ServerModule[Ctx, SchemaInitializer] = {
    modules.foldLeft(this.queries)((queries, module) => queries ++= module.queries)
    modules.foldLeft(this.mutations)((mutations, module) => mutations ++= module.mutations)
    modules.foldLeft(this.subscriptions)((subscriptions, module) => subscriptions ++= module.subscriptions)
    modules.foldLeft(this.extensions)((extensions, module) => extensions ++= module.extensions)
    modules.foldLeft(this.slickSchemas)((slickSchemas, module) => slickSchemas ++= module.slickSchemas)
    modules.foldLeft(this.routes)((routes, module) => routes ++= module.routes)
    this
  }
}
