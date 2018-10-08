package controllers.graphql.jsonProtocols

import spray.json.{DefaultJsonProtocol, JsObject, RootJsonFormat}

case class GraphQLMessage(query: String, operationName: Option[String] = None, variables: Option[JsObject] = None)

object GraphQLMessage {
  val graphQlWebsocketProtocol: String = "graphql-ws"
}

object GraphQLMessageProtocol extends DefaultJsonProtocol {
  implicit val graphQLMessageFormat: RootJsonFormat[GraphQLMessage] = jsonFormat3(GraphQLMessage.apply)
}