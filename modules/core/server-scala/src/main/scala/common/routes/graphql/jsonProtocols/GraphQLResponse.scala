package common.routes.graphql.jsonProtocols

import spray.json.{DefaultJsonProtocol, JsValue, RootJsonFormat}

case class GraphQLResponse(data: JsValue, errors: Option[JsValue] = None)

object GraphQLResponseJsonProtocol extends DefaultJsonProtocol {
  implicit val graphQLResponseFormat: RootJsonFormat[GraphQLResponse] = jsonFormat2(GraphQLResponse.apply)
}
