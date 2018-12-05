package common.shapes

import core.routes.AkkaRoute

import scala.collection.mutable

trait AkkaRouteShape {
  val routes: mutable.HashSet[AkkaRoute] = mutable.HashSet.empty
}