package core.controllers.graphql.jsonProtocols

import core.controllers.graphql.jsonProtocols.OperationMessageType.OperationMessageType
import spray.json.{DefaultJsonProtocol, DeserializationException, JsObject, JsString, JsValue, JsonFormat}

case class OperationMessage(operationType: OperationMessageType, id: Option[String] = None, payload: Option[JsValue] = None)

object OperationMessageType extends Enumeration {
  type OperationMessageType = Value
  val GQL_CONNECTION_INIT: Value = Value("connection_init")
  val GQL_CONNECTION_ACK: Value = Value("connection_ack")
  val GQL_CONNECTION_ERROR: Value = Value("connection_error")
  val GQL_CONNECTION_KEEP_ALIVE: Value = Value("ka")
  val GQL_CONNECTION_TERMINATE: Value = Value("connection_terminate")
  val GQL_START: Value = Value("start")
  val GQL_DATA: Value = Value("data")
  val GQL_ERROR: Value = Value("error")
  val GQL_COMPLETE: Value = Value("complete")
  val GQL_STOP: Value = Value("stop")
  val SUBSCRIPTION_START: Value = Value("subscription_start")
  val SUBSCRIPTION_DATA: Value = Value("subscription_data")
  val SUBSCRIPTION_SUCCESS: Value = Value("subscription_success")
  val SUBSCRIPTION_FAIL: Value = Value("subscription_fail")
  val SUBSCRIPTION_END: Value = Value("subscription_end")
  val INIT: Value = Value("init")
  val INIT_SUCCESS: Value = Value("init_success")
  val INIT_FAIL: Value = Value("init_fail")
  val KEEP_ALIVE: Value = Value("keepalive")
}

object OperationMessageJsonProtocol extends DefaultJsonProtocol {

  implicit object OperationMessageTypeJsonFormat extends JsonFormat[OperationMessageType] {
    def write(obj: OperationMessageType): JsValue = JsString(obj.toString)

    def read(json: JsValue): OperationMessageType = json match {
      case JsString(str) => OperationMessageType.withName(str)
      case _ => throw DeserializationException("Enumeration string expected")
    }
  }

  implicit object OperationMessageJsonFormat extends JsonFormat[OperationMessage] {
    def write(operationMessage: OperationMessage) = JsObject(
      "type" -> JsString(operationMessage.operationType.toString),
      "id" -> JsString(operationMessage.id.getOrElse("")),
      "payload" -> operationMessage.payload.getOrElse(JsObject.empty),
    )

    def read(value: JsValue): OperationMessage = {
      value.asJsObject.getFields("type", "id", "payload") match {
        case Seq(operationMessageType) =>
          OperationMessage(OperationMessageTypeJsonFormat.read(operationMessageType), None, None)
        case Seq(operationMessageType, JsString(id)) =>
          OperationMessage(OperationMessageTypeJsonFormat.read(operationMessageType), Some(id), None)
        case Seq(operationMessageType, payload) =>
          OperationMessage(OperationMessageTypeJsonFormat.read(operationMessageType), None, Some(payload))
        case Seq(operationMessageType, JsString(id), payload) =>
          OperationMessage(OperationMessageTypeJsonFormat.read(operationMessageType), Some(id), Some(payload))
        case _ =>
          throw DeserializationException("OperationMessage expected")
      }
    }
  }

}