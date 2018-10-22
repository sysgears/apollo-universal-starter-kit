package core.controllers.graphql

import java.util.Date

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.util.ByteString
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import modules.graphql.types.DateHelper._
import spray.json._
import util.Logger

class GraphQLTypesSpec extends TestHelper with Logger {
  "GraphQLController" must {
    "set new dateTime" in {
      val date = dateTimeFormat.format(new Date())

      log.info(s"DateTime format: $date")

      val mutation = s"""mutation DateTime { setDateTime(dateTime: \"$date\") }"""
      val mutationGraphQLMessage = ByteString(GraphQLMessage(mutation).toJson.compactPrint)
      val mutationEntity = HttpEntity(`application/json`, mutationGraphQLMessage)

      Post(endpoint, mutationEntity) ~> routes ~> check {
        status shouldBe OK
      }

      val query = "query DateTime { dateTime }"
      val queryGraphQLMessage = ByteString(GraphQLMessage(query).toJson.compactPrint)
      val queryEntity = HttpEntity(`application/json`, queryGraphQLMessage)

      Post(endpoint, queryEntity) ~> routes ~> check {
        val responseDate = parseDate(responseAs[String])

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`

        responseDate shouldBe date
      }
    }
    "set new date" in {
      val date = dateFormat.format(new Date())

      log.info(s"Date format: $date")

      val mutation = s"""mutation Date { setDate(date: \"$date\") }"""
      val mutationGraphQLMessage = ByteString(GraphQLMessage(mutation).toJson.compactPrint)
      val mutationEntity = HttpEntity(`application/json`, mutationGraphQLMessage)

      Post(endpoint, mutationEntity) ~> routes ~> check {
        status shouldBe OK
      }

      val query = "query Date { date }"
      val queryGraphQLMessage = ByteString(GraphQLMessage(query).toJson.compactPrint)
      val queryEntity = HttpEntity(`application/json`, queryGraphQLMessage)

      Post(endpoint, queryEntity) ~> routes ~> check {
        val responseDate = parseDate(responseAs[String])

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`

        responseDate shouldBe date
      }
    }
    "set new time" in {
      val date = timeFormat.format(new Date())

      log.info(s"Time format: $date")

      val mutation = s"""mutation Time { setTime(time: \"$date\") }"""
      val mutationGraphQLMessage = ByteString(GraphQLMessage(mutation).toJson.compactPrint)
      val mutationEntity = HttpEntity(`application/json`, mutationGraphQLMessage)

      Post(endpoint, mutationEntity) ~> routes ~> check {
        status shouldBe OK
      }

      val query = "query Time { time }"
      val queryGraphQLMessage = ByteString(GraphQLMessage(query).toJson.compactPrint)
      val queryEntity = HttpEntity(`application/json`, queryGraphQLMessage)

      Post(endpoint, queryEntity) ~> routes ~> check {
        val responseDate = parseDate(responseAs[String])

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`

        responseDate shouldBe date
      }
    }
  }

  private def parseDate(response: String) = {
    response.parseJson.asJsObject.fields("data").asJsObject.fields.head._2.convertTo[String]
  }
}