package common.shapes

import common.slick.SchemaInitializer

import scala.collection.mutable

trait SlickSchemaShape {
  lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet.empty
}