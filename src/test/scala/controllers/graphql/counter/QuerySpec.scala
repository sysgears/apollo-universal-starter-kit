package controllers.graphql.counter

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.util.ByteString
import controllers.graphql.GraphQLController
import controllers.graphql.jsonProtocols.GraphQLMessage
import controllers.graphql.jsonProtocols.GraphQLMessageProtocol._
import models.counter.Counter
import org.scalatest.{Matchers, WordSpec}
import spray.json._
import util.Injecting

class QuerySpec extends WordSpec with Matchers with ScalatestRouteTest with Injecting {

  val routes: Route = inject[GraphQLController].Routes

  val addServerCounterMutation = "mutation Increment { addServerCounter(amount: 2) { amount } }"
  val addServerCounterGraphQLMessage = ByteString(GraphQLMessage(addServerCounterMutation, None, None).toJson.compactPrint)
  val addServerCounterEntity = HttpEntity(`application/json`, addServerCounterGraphQLMessage)

  val serverCounter = "query IncrementAndGet { serverCounter { amount } }"
  val serverCounterGraphQLMessage = ByteString(GraphQLMessage(serverCounter, None, None).toJson.compactPrint)
  val serverCounterEntity = HttpEntity(`application/json`, serverCounterGraphQLMessage)

  "GraphQLController" must {

    "increment and get amount of counter" in {
      Post("/graphql", addServerCounterEntity) ~> routes ~> check {
        val counter = responseAs[String].parseJson.convertTo[Counter](CounterJsonReader)

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        counter.amount shouldBe 2
      }
      Post("/graphql", serverCounterEntity) ~> routes ~> check {
        val counter = responseAs[String].parseJson.convertTo[Counter](CounterJsonReader)

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        counter.amount shouldBe 2
      }
    }
  }
}

object CounterJsonReader extends JsonReader[Counter] {
  override def read(json: JsValue): Counter = {
    val fields = json.asJsObject.fields
    val counter = fields("data").asJsObject.fields.head._2
    val amount: JsNumber = counter.asJsObject.fields("amount").asInstanceOf[JsNumber]
    Counter(amount.value.toInt)
  }
}