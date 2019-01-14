import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.util.ByteString
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import spray.json._

class PostSpec extends PostHelper {

  def graphQLMessage(query: String) = ByteString(GraphQLMessage(query).toJson.compactPrint)

  "PostSpec" must {

    "retrieve a post by its public id" in {

      val queryPost = s"query { " +
        s"post(id: 1 ) { id, title , comments { id } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"post\":{\"id\":1,\"title\":\"Post title #[1]\",\"comments\":" +
          "[{\"id\":1},{\"id\":2},{\"id\":3},{\"id\":4},{\"id\":5},{\"id\":6},{\"id\":7},{\"id\":8},{\"id\":9},{\"id\":10}]}}}"
      }
    }

    "retrieve a posts by specified params: limit, after" in {

      val queryPosts = s"query { " +
        s"posts( limit: 2, after: 1 ) { totalCount, edges {cursor, node{id}}, pageInfo {endCursor, hasNextPage} } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryPosts))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"posts\":{\"totalCount\":5,\"edges\":[{\"cursor\":2,\"node\":{\"id\":2}}," +
          "{\"cursor\":3,\"node\":{\"id\":3}}],\"pageInfo\":{\"endCursor\":1,\"hasNextPage\":true}}}}"
      }
    }

    "save a new post" in {

      val mutationAddPost =
        "mutation {addPost(input: {title: \"New Post\", content: \"Content post\"}) {id title content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addPost\":{\"id\":6,\"title\":\"New Post\",\"content\":\"Content post\"}}}"
      }
    }

    "edit an existed post" in {

      val mutationEditPost =
        "mutation { editPost(input: {id: 1, title: \"Updated post\", content: \"Updated content post\"}) {id title content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"editPost\":{\"id\":1,\"title\":\"Updated post\",\"content\":\"Updated content post\"}}}"
      }
    }

    "not edit not existed post" in {

      val mutationEditPost = "mutation { editPost(input: {id: 100, title: \"Updated post\", content: " +
        "\"Updated content post\"}) {id title content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"editPost\":null},\"errors\":[{\"message\":\"Post with id: 100 not found.\"," +
          "\"path\":[\"editPost\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }

    "delete an existed post" in {

      val mutationEditPost = "mutation { deletePost(id: 1) {id}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"deletePost\":{\"id\":1}}}"

        val queryPosts = s"query { " +
          s"posts { totalCount } }"

        val entity = HttpEntity(`application/json`, graphQLMessage(queryPosts))
        Post(endpoint, entity) ~> routes ~> check {
          status shouldBe OK
          val result = responseAs[String]
          result shouldEqual "{\"data\":{\"posts\":{\"totalCount\":4}}}"
        }
      }
    }

    "not delete a not existed post" in {

      val mutationEditPost = "mutation { deletePost(id: 100) {id}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"deletePost\":null},\"errors\":[{\"message\":\"Post with id: 100 not found.\"," +
          "\"path\":[\"deletePost\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"

        val queryPosts = s"query { " +
          s"posts { totalCount } }"

        val entity = HttpEntity(`application/json`, graphQLMessage(queryPosts))
        Post(endpoint, entity) ~> routes ~> check {
          status shouldBe OK
          val result = responseAs[String]
          result shouldEqual "{\"data\":{\"posts\":{\"totalCount\":5}}}"
        }
      }
    }

    "add comment to existed post" in {

      val mutationAddComment = "mutation { addComment(input: {postId: 1, content: \"New comment\"}) {id content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddComment))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addComment\":{\"id\":11,\"content\":\"New comment\"}}}"
      }
    }

    "not add comment to non existed post" in {

      val mutationAddComment = "mutation { addComment(input: {postId: 100, content: \"New comment\"}) {id content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddComment))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addComment\":null},\"errors\":[{\"message\":\"Couldn't add a comment. " +
          "Post with id: 100 not found.\",\"path\":[\"addComment\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }

    "edit an existed comment" in {

      val mutationEditComment =
        "mutation { editComment(input: {id: 1, postId: 1, content: \"Updated comment\"}) {id content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditComment))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"editComment\":{\"id\":1,\"content\":\"Updated comment\"}}}"
      }
    }

    "not edit a not existed comment" in {

      val mutationEditComment =
        "mutation { editComment(input: {id: 100, postId: 1, content: \"Updated comment\"}) {id content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditComment))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"editComment\":null},\"errors\":[{\"message\":\"Comment with id: 100 not found.\"" +
          ",\"path\":[\"editComment\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }

    "delete an existed comment" in {

      val mutationEditPost = "mutation { deleteComment(input: {id: 1, postId: 1}) {id}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"deleteComment\":{\"id\":1}}}"
      }
    }

    "not delete a not existed comment" in {

      val mutationEditPost = "mutation { deleteComment(input: {id: 100, postId: 1}) {id}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        println(result)
        result shouldEqual "{\"data\":{\"deleteComment\":null},\"errors\":[{\"message\":\"Comment with id: 100 not found.\"," +
          "\"path\":[\"deleteComment\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }
  }
}
