package common.shapes

import core.slick.SchemaInitializer

import scala.collection.mutable

trait SlickSchemaShape {
  val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet.empty
}