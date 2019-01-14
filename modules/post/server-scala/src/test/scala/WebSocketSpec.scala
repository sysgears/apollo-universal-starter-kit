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

          wsClient.sendMessage(
            start(
              Some(GraphQLMessage("subscription onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}").toJson)
            )
          )
          wsClient.expectNoMessage()

          val editPostMutationFirst = GraphQLMessage(
            "mutation { editPost(input: {id: 1 title: \"New title\", content: \"Content post\" }) {id title }}"
          ).toJson
          val editPostMutationEntityFirst = HttpEntity(`application/json`, editPostMutationFirst.compactPrint)

          Post(endpoint, editPostMutationEntityFirst) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editPost\":{\"id\":1,\"title\":\"New title\"}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"postUpdated\":{\"mutation\":\"editPost\",\"node\":{\"id\":1,\"title\":\"New title\"}}}".parseJson
                  ).toJson
                )
              )
            )
          }

          val editPostMutationSecond = GraphQLMessage(
            "mutation { editPost(input: {id: 1 title: \"Old title\", content: \"Content post\" }) {id title }}"
          ).toJson
          val editPostMutationEntitySecond = HttpEntity(`application/json`, editPostMutationSecond.compactPrint)

          Post(endpoint, editPostMutationEntitySecond) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editPost\":{\"id\":1,\"title\":\"Old title\"}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"postUpdated\":{\"mutation\":\"editPost\",\"node\":{\"id\":1,\"title\":\"Old title\"}}}".parseJson
                  ).toJson
                )
              )
            )
          }

          wsClient.sendCompletion()
          wsClient.expectCompletion()
        }
    }
    "subscribe to comment updated events and receive several event" in {
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
                  "subscription onCommentUpdated {commentUpdated(postId: 1) {mutation, postId, node {id content}}}"
                ).toJson
              )
            )
          )
          wsClient.expectNoMessage()

          val editCommentMutationFirst = GraphQLMessage(
            "mutation { editComment(input: {id: 1, content: \"New comment\", postId: 1}) {id content }}"
          ).toJson
          val editCommentMutationEntityFirst = HttpEntity(`application/json`, editCommentMutationFirst.compactPrint)

          Post(endpoint, editCommentMutationEntityFirst) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editComment\":{\"id\":1,\"content\":\"New comment\"}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"commentUpdated\":{\"mutation\":\"editComment\",\"postId\":1,\"node\":{\"id\":1,\"content\":\"New comment\"}}}".parseJson
                  ).toJson
                )
              )
            )
          }

          val editCommentMutationSecond = GraphQLMessage(
            "mutation { editComment(input: {id: 1, content: \"Old comment\", postId: 1}) {id content }}"
          ).toJson
          val editCommentMutationEntitySecond = HttpEntity(`application/json`, editCommentMutationSecond.compactPrint)

          Post(endpoint, editCommentMutationEntitySecond) ~> routes ~> check {
            status shouldBe OK
            val result = responseAs[String]
            result shouldEqual "{\"data\":{\"editComment\":{\"id\":1,\"content\":\"Old comment\"}}}"

            wsClient.expectMessage(
              data(
                Some(
                  GraphQLResponse(
                    "{\"commentUpdated\":{\"mutation\":\"editComment\",\"postId\":1,\"node\":{\"id\":1,\"content\":\"Old comment\"}}}".parseJson
                  ).toJson
                )
              )
            )
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

          wsClient.sendMessage(
            start(
              Some(
                GraphQLMessage("subscriptionFail onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}").toJson
              )
            )
          )
          wsClient.expectMessage(
            error(
              Some(
                "{\"syntaxError\":\"Syntax error while parsing GraphQL query. Invalid input \\\"subscriptionF\\\", expected ExecutableDefinition or TypeSystemDefinition (line 1, column 1):\\nsubscriptionFail onPostUpdated {postUpdated(id: 1) {mutation, node {id title}}}\\n^\",\"locations\":[{\"line\":1,\"column\":1}]}".parseJson
              )
            )
          )

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

          wsClient.sendMessage(
            start(
              Some(
                GraphQLMessage(
                  "mutation { editPost(input: {id: 1 title: \"New title\", content: \"Content post\" }) {id title }}"
                ).toJson
              )
            )
          )
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

  private def createOperationMessage(
      operationType: OperationMessageType
  )(id: Option[String] = None)(payload: Option[JsValue] = None) = {
    OperationMessage(operationType, id, payload).toJson.compactPrint
  }
}
