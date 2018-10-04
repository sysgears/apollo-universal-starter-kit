package controllers.graphql

import akka.http.scaladsl.model.{HttpEntity, MediaTypes, StatusCodes}
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.util.ByteString
import models.counter.Counter
import org.scalatest.{Matchers, WordSpec}
import spray.json._
import util.Injecting

class GraphQLControllerSpec extends WordSpec with Matchers with ScalatestRouteTest with Injecting {

  val routes: Route = inject[GraphQLController].Routes
  val addServerCounter = ByteString(
    """
      [
          {
              "query" : "mutation Increment { addServerCounter(amount: 2) { amount } }"
          }
      ]
    """.stripMargin
  )

  "GraphQLControler" must {

    "increment amount of counter" in {
      implicit val counterJsonReader = CounterJsonReader

      val contentType = MediaTypes.`application/json`
      val addServerCounterEntity = HttpEntity(contentType, addServerCounter)

      Post("/graphql", addServerCounterEntity) ~> routes ~> check {

        status shouldBe StatusCodes.OK
        contentType shouldBe MediaTypes.`application/json`

        val counter = responseAs[String].parseJson.convertTo[Counter]
        counter.amount shouldBe 2
      }
    }
  }
}

object CounterJsonReader extends JsonReader[Counter] {
  override def read(json: JsValue): Counter = {
    val fields = json.asJsObject.fields
    val serverCounter = fields("data").asJsObject.fields("addServerCounter")
    val amount: JsNumber = serverCounter.asJsObject.fields("amount").asInstanceOf[JsNumber]
    Counter(amount.value.toInt)
  }
}