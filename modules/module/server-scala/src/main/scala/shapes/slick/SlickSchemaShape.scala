package shapes.slick

import scala.collection.mutable

trait SlickSchemaShape[SchemaInitializer] {
  lazy val slickSchemas: mutable.HashSet[SchemaInitializer] = mutable.HashSet.empty
}