import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.testkit.WSProbe
import akka.http.scaladsl.model.StatusCodes.OK
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessage.graphQlWebsocketProtocol
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.GraphQLResponseJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageType._
import common.routes.graphql.jsonProtocols.{GraphQLResponse, OperationMessage}
import spray.json._

class WebSocketSpec extends PostHelper {

  private val websocketProtocol = Seq(graphQlWebsocketProtocol)
  private val websocketMessageId = Some("1")

  "WebSocket" must {
    "subscribe to post updated events and receive several event" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("subscription onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}").toJson)))
          wsClient.expectNoMessage()

          val editPostMutation1 = GraphQLMessage("mutation { editPost(input: {id: 1 title: \"New title\", content: \"Content post\" }) {id title }}").toJson
          val editPostMutationEntity1 = HttpEntity(`application/json`, editPostMutation1.compactPrint)

          Post(endpoint, editPostMutationEntity1) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editPost\":{\"id\":1,\"title\":\"New title\"}}}"

            wsClient.expectMessage(data(Some(GraphQLResponse("{\"postUpdated\":{\"mutation\":\"editPost\",\"node\":{\"id\":1,\"title\":\"New title\"}}}".parseJson).toJson)))          }

          val editPostMutation2 = GraphQLMessage("mutation { editPost(input: {id: 1 title: \"Old title\", content: \"Content post\" }) {id title }}").toJson
          val editPostMutationEntity2 = HttpEntity(`application/json`, editPostMutation2.compactPrint)

          Post(endpoint, editPostMutationEntity2) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editPost\":{\"id\":1,\"title\":\"Old title\"}}}"

            wsClient.expectMessage(data(Some(GraphQLResponse("{\"postUpdated\":{\"mutation\":\"editPost\",\"node\":{\"id\":1,\"title\":\"Old title\"}}}".parseJson).toJson)))
          }

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
    "not subscribe to post updated events with invalid operation name in query" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("subscriptionFail onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}").toJson)))
          wsClient.expectMessage(error(Some("{\"syntaxError\":\"Syntax error while parsing GraphQL query. Invalid input \\\"subscriptionF\\\", expected ExecutableDefinition or TypeSystemDefinition (line 1, column 1):\\nsubscriptionFail onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}\\n^\",\"locations\":[{\"line\":1,\"column\":1}]}".parseJson)))

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
    "not subscribe to post updated events with unsupported operation (mutation)" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(start(Some(GraphQLMessage("mutation { editPost(input: {id: 1 title: \"New title\", content: \"Content post\" }) {id title }}").toJson)))
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
}
