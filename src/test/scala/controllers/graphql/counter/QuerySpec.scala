package controllers.graphql.counter

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.util.ByteString
import controllers.graphql.TestHelper
import controllers.graphql.jsonProtocols.GraphQLMessage
import controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import models.counter.Counter
import spray.json._

class QuerySpec extends TestHelper {

  val addServerCounterMutation = "mutation Increment { addServerCounter(amount: 1) { amount } }"
  val addServerCounterGraphQLMessage = ByteString(GraphQLMessage(addServerCounterMutation).toJson.compactPrint)
  val addServerCounterEntity = HttpEntity(`application/json`, addServerCounterGraphQLMessage)

  val serverCounter = "query IncrementAndGet { serverCounter { amount } }"
  val serverCounterGraphQLMessage = ByteString(GraphQLMessage(serverCounter).toJson.compactPrint)
  val serverCounterEntity = HttpEntity(`application/json`, serverCounterGraphQLMessage)

  val batchQueries = Seq(GraphQLMessage(addServerCounterMutation, Some("Increment")), GraphQLMessage(serverCounter, Some("IncrementAndGet")))
  val batchEntity = HttpEntity(`application/json`, batchQueries.toJson.compactPrint)
  "GraphQLController" must {

    implicit val counterJsonReader = CounterJsonReader

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

    "execute batch query" in {
      Post(endpoint, batchEntity) ~> routes ~> check {
        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
      }
    }
  }
}

object CounterJsonReader extends JsonReader[Counter] with DefaultJsonProtocol {
  override def read(json: JsValue): Counter = {
    val data = json.asJsObject.fields("data").asJsObject
    data.fields.head._2.convertTo[Counter](jsonFormat1(Counter.apply))
  }
}