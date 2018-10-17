package controllers.graphql.jsonProtocols

import spray.json.{DefaultJsonProtocol, JsObject, RootJsonFormat}

case class GraphQLMessage(query: String, operationName: Option[String], variables: Option[JsObject])

object GraphQLMessageJsonProtocol extends DefaultJsonProtocol {
  implicit val graphQLMessageJsonFormat: RootJsonFormat[GraphQLMessage] = jsonFormat3(GraphQLMessage)
}