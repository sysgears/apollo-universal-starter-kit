import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.implicits.RichDBIO._
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import model.Item
import repositories.ItemRepository
import spray.json._

import scala.concurrent.duration._

class PaginationSpec extends PaginationHelper {

  lazy val itemRepo: ItemRepository = inject[ItemRepository]
  val offset = 0
  val limit = 3
  val query =
    s"query { getPaginatedList(input: { offset: $offset, limit:$limit } ) { totalCount, entities { description }, hasNextPage } }"
  val graphQLMessage = ByteString(GraphQLMessage(query).toJson.compactPrint)

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  "PaginationSpec" must {

    "return paginated list of objects" in {
      val testObject1 = await(itemRepo.save(Item(None, "Object1")).run)
      val testObject2 = await(itemRepo.save(Item(None, "Object2")).run)
      val testObject3 = await(itemRepo.save(Item(None, "Object3")).run)
      val testObject4 = await(itemRepo.save(Item(None, "Object4")).run)

      val entity = HttpEntity(`application/json`, graphQLMessage)
      Post(endpoint, entity) ~> routes ~> check {
        val paginatedResult = responseAs[String]
        println(paginatedResult)
        paginatedResult shouldEqual "{\"data\":" +
          "{\"getPaginatedList\":{\"totalCount\":103,\"entities\":[{\"description\":\"Item 1\"},{\"description\":\"Item 2\"},{\"description\":\"Item 3\"}]," +
          "\"hasNextPage\":true}}}"
      }
    }

  }
}
