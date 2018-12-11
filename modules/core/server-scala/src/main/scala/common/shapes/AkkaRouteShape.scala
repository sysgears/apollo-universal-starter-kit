package common.shapes

import common.routes.AkkaRoute

import scala.collection.mutable

trait AkkaRouteShape {
  val routes: mutable.HashSet[AkkaRoute] = mutable.HashSet.empty
}