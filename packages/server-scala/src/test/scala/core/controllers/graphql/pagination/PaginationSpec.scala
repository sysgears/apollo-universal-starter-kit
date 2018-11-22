package core.controllers.graphql.pagination

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.util.ByteString
import core.controllers.graphql.TestHelper
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import scala.concurrent.duration._
import akka.testkit.TestDuration
import spray.json._

class PaginationSpec extends TestHelper {

  val offset = 0
  val limit = 3
  val query = s"query { getPaginatedList(offset:$offset, limit:$limit) { totalCount, entities { description }, hasNextPage } }"
  val graphQLMessage = ByteString(GraphQLMessage(query).toJson.compactPrint)

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  "PaginationSpec" must {

    "return paginated list of objects" in {
      val entity = HttpEntity(`application/json`, graphQLMessage)
      Post(endpoint, entity) ~> routes ~> check {
        val paginatedResult = responseAs[String]
        println(paginatedResult)
        paginatedResult.contains("hasNextPage")
      }
    }

  }
}
