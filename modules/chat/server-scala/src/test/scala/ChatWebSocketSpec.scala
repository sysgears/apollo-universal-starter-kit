import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.testkit.WSProbe
import common.routes.graphql.jsonProtocols.GraphQLMessage.graphQlWebsocketProtocol
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.GraphQLResponseJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageType._
import common.routes.graphql.jsonProtocols.{GraphQLMessage, GraphQLResponse, OperationMessage}
import spray.json._

class ChatWebSocketSpec extends ChatHelper {

  private val websocketProtocol = Seq(graphQlWebsocketProtocol)
  private val websocketMessageId = Some("1")

  "ChatWebSocketSpec" must {
    "subscribe to message updated events and receive several event" in {
      val wsClient = WSProbe()
      WS(endpoint, wsClient.flow, websocketProtocol) ~> routes ~>
        check {
          isWebSocketUpgrade shouldEqual true

          wsClient.sendMessage(init)
          wsClient.expectMessage(ack)

          wsClient.sendMessage(
            start(
              Some(
                GraphQLMessage(
                  "subscription messagesUpdated {messagesUpdated(endCursor:1) {mutation id node { id text }}}"
                ).toJson
              )
            )
          )
          wsClient.expectNoMessage()

          val editMessageMutation = GraphQLMessage(
            "mutation { editMessage ( input: { id:1 text: \"UPDATED TEXT\" userId:1 }){ id text userId username } }"
          ).toJson
          val editMessageMutationEntity = HttpEntity(`application/json`, editMessageMutation.compactPrint)

          Post(endpoint, editMessageMutationEntity) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editMessage\":{\"id\":1,\"text\":\"UPDATED TEXT\",\"userId\":1,\"username\":\"testUser\"}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"messagesUpdated\":{\"mutation\":\"editMessage\",\"id\":1,\"node\":{\"id\":1,\"text\":\"UPDATED TEXT\"}}}".parseJson
                  ).toJson
                )
              )
            )
          }

          val addMessageMutation = GraphQLMessage(
            "mutation { addMessage ( input: { text:\" added any \", userId:1, uuid:\"dfsgadrfhafrhadshb\", quotedId:2}){ id text userId username quotedId quotedMessage{ id text }}}"
          ).toJson
          val addMessageMutationEntity = HttpEntity(`application/json`, addMessageMutation.compactPrint)

          Post(endpoint, addMessageMutationEntity) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"addMessage\":{" +
              "\"username\":\"testUser\",\"quotedMessage\":{\"id\":2,\"text\":\"Message text #[2]\"},\"quotedId\":2,\"text\":\" added any \",\"id\":5,\"userId\":1}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"messagesUpdated\":{\"mutation\":\"addMessage\",\"id\":5,\"node\":{\"id\":5,\"text\":\" added any \"}}}".parseJson
                  ).toJson
                )
              )
            )
          }

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

  private def createOperationMessage(
      operationType: OperationMessageType
  )(id: Option[String] = None)(payload: Option[JsValue] = None) = {
    OperationMessage(operationType, id, payload).toJson.compactPrint
  }
}
