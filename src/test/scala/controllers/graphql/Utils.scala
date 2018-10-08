package controllers.graphql

import akka.http.scaladsl.server.Route
import util.Injecting

object Utils extends Injecting {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].Routes

}
