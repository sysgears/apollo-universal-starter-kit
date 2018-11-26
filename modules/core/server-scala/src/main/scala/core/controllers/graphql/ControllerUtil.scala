package core.controllers.graphql

import sangria.parser.SyntaxError
import spray.json.{JsArray, JsNumber, JsObject, JsString}

trait ControllerUtil {

  def syntaxError(error: SyntaxError) = JsObject(
    "syntaxError" -> JsString(error.getMessage),
    "locations" -> JsArray(
      JsObject(
        "line" -> JsNumber(error.originalError.position.line),
        "column" -> JsNumber(error.originalError.position.column)
      )
    )
  )
}