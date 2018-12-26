import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import models.Counter
import spray.json._

import scala.concurrent.duration._

class CounterSpec extends CounterSpecHelper {

  val addServerCounterMutation = "mutation Increment { addServerCounter(amount: 1) { amount } }"
  val addServerCounterGraphQLMessage = ByteString(GraphQLMessage(addServerCounterMutation).toJson.compactPrint)
  val addServerCounterEntity = HttpEntity(`application/json`, addServerCounterGraphQLMessage)

  val serverCounter = "query Get { serverCounter { amount } }"
  val serverCounterGraphQLMessage = ByteString(GraphQLMessage(serverCounter).toJson.compactPrint)
  val serverCounterEntity = HttpEntity(`application/json`, serverCounterGraphQLMessage)

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  "Counter" must {

    implicit val counterJsonReader: CounterJsonReader.type = CounterJsonReader

    "increment amount of counter" in {
      Post(endpoint, addServerCounterEntity) ~> routes ~> check {
        val counter = responseAs[String].parseJson.convertTo[Counter]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        counter.amount shouldBe 1
      }
    }

    "increment several times and then get an amount of counter" in {
      Post(endpoint, addServerCounterEntity) ~> routes ~> check {

        Post(endpoint, addServerCounterEntity) ~> routes ~> check {
          val counter = responseAs[String].parseJson.convertTo[Counter]

          status shouldBe OK
          contentType.mediaType shouldBe `application/json`
          counter.amount shouldBe 2
        }

        Post(endpoint, serverCounterEntity) ~> routes ~> check {
          val counter = responseAs[String].parseJson.convertTo[Counter]

          status shouldBe OK
          contentType.mediaType shouldBe `application/json`
          counter.amount shouldBe 2
        }
      }
    }

    "execute batch mutation" in {

      val batchQueries = Array(
        GraphQLMessage(
          "mutation Increment1 { addServerCounter(amount: 1) { amount } }", Some("Increment1")
        ),
        GraphQLMessage(
          "mutation Increment2 { addServerCounter(amount: 1) { amount } }", Some("Increment2")
        )
      )
      val batchEntity = HttpEntity(`application/json`, batchQueries.toJson.compactPrint)

      Post(endpoint, batchEntity) ~> routes ~> check {
        status shouldBe OK
        contentType.mediaType shouldBe `application/json`

        responseAs[String] should include("\"batch\":{\"operationName\":\"Increment1\"}")
        responseAs[String] should include("\"batch\":{\"operationName\":\"Increment2\"}")

        responseAs[String] should include("{\"addServerCounter\":{\"amount\":1}}")
        responseAs[String] should include("{\"addServerCounter\":{\"amount\":2}}")
      }
    }
  }

  override def clean(): Unit = {}
}

object CounterJsonReader extends JsonReader[Counter] with DefaultJsonProtocol {
  override def read(json: JsValue): Counter = {
    val data = json.asJsObject.fields("data").asJsObject
    data.fields.head._2.convertTo[Counter](jsonFormat2(Counter))
  }
}