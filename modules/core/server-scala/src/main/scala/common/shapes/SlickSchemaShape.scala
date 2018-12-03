package common.shapes

import core.slick.SchemaInitializer

trait SlickSchemaShape {
  val slickSchemaModules: List[SchemaInitializer[_]] = List.empty
}