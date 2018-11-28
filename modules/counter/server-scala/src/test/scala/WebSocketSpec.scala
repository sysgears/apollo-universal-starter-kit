import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.testkit.WSProbe
import core.controllers.graphql.jsonProtocols.GraphQLMessage.graphQlWebsocketProtocol
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import core.controllers.graphql.jsonProtocols.GraphQLResponseJsonProtocol._
import core.controllers.graphql.jsonProtocols.OperationMessageJsonProtocol._
import core.controllers.graphql.jsonProtocols.OperationMessageType._
import core.controllers.graphql.jsonProtocols.{GraphQLMessage, GraphQLResponse, OperationMessage}
import spray.json._

class WebSocketSpec extends CounterSpecHelper {

  private val websocketProtocol = Seq(graphQlWebsocketProtocol)
  private val websocketMessageId = Some("1")

  "WebSocket" must {
    "subscribe to counter updated events and receive several event" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("subscription counterUpdated { counterUpdated { amount } }").toJson)))
          wsClient.expectNoMessage()

          val addServerCounterMutation = GraphQLMessage("mutation addServerCounter { addServerCounter(amount: 1) { amount } }").toJson
          val addServerCounterMutationEntity = HttpEntity(`application/json`, addServerCounterMutation.compactPrint)

          Post(endpoint, addServerCounterMutationEntity) ~> routes
          wsClient.expectMessage(data(Some(GraphQLResponse("{ \"counterUpdated\": { \"amount\": 1 } }".parseJson).toJson)))

          Post(endpoint, addServerCounterMutationEntity) ~> routes
          wsClient.expectMessage(data(Some(GraphQLResponse("{ \"counterUpdated\": { \"amount\": 2 } }".parseJson).toJson)))

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
    "not subscribe to counter updated events with invalid operation name in query" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("subscriptionS counterUpdated { counterUpdated { amount } }").toJson)))
          wsClient.expectMessage(error(Some("{ \"syntaxError\":\"Syntax error while parsing GraphQL query. Invalid input \\\"subscriptionS\\\", expected ExecutableDefinition or TypeSystemDefinition (line 1, column 1):\\nsubscriptionS counterUpdated { counterUpdated { amount } }\\n^\", \"locations\":[ { \"line\":1, \"column\":1 } ] }".parseJson)))

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
    "not subscribe to counter updated events with unsupported operation (mutation)" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("mutation addServerCounter { addServerCounter(amount: 1) { amount } }").toJson)))
          wsClient.expectMessage(error(Some("\"Unsupported type: Some(Mutation)\"".parseJson)))

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
  }

  private val init = createOperationMessage(GQL_CONNECTION_INIT)(None)(None)
  private val ack = createOperationMessage(GQL_CONNECTION_ACK)(None)(None)
  private val start = createOperationMessage(GQL_START)(websocketMessageId)(_)
  private val data = createOperationMessage(GQL_DATA)(websocketMessageId)(_)
  private val error = createOperationMessage(GQL_ERROR)(websocketMessageId)(_)

  private def createOperationMessage(operationType: OperationMessageType)
                                    (id: Option[String] = None)
                                    (payload: Option[JsValue] = None) = {
    OperationMessage(operationType, id, payload).toJson.compactPrint
  }

  override def clean(): Unit = {}
}