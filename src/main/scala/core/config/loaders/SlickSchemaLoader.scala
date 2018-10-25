package core.config.loaders

import core.guice.injection.Injecting.loadClasses
import core.slick.SchemaInitializer

object SlickSchemaLoader {
  val slickSchemas: List[SchemaInitializer] = loadClasses[SchemaInitializer]("slick.schemas")
}