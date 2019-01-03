package shapes

import akka.http.scaladsl.server.Route

import scala.collection.mutable

trait AkkaRouteShape {
  lazy val routes: mutable.HashSet[Route] = mutable.HashSet.empty
}