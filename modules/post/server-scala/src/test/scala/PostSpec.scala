import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.model.StatusCodes.NotFound
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.implicits.RichDBIO._
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import repositories.{CommentRepository, PostRepository}
import spray.json._


import scala.concurrent.duration._

class PostSpec extends PostHelper {

  lazy val postRepo: PostRepository = inject[PostRepository]
  lazy val commentRepo: CommentRepository = inject[CommentRepository]

  def graphQLMessage(query: String) = ByteString(GraphQLMessage(query).toJson.compactPrint)

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

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

      val mutationAddPost = "mutation {addPost(input: {title: \"New Post\", content: \"Content post\"}) {id title content}}"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddPost))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addPost\":{\"id\":6,\"title\":\"New Post\",\"content\":\"Content post\"}}}"
      }
    }

    "edit an existed post" in {

      val mutationEditPost = "mutation { editPost(input: {id: 1, title: \"Updated post\", content: \"Updated content post\"}) {id title content}}"

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

    "net delete not existed post" in {

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
  }

  def seedPostDatabase = {
    val posts = List.range(1, 6).map(num =>
      model.Post(id = Some(num),
        title = s"Post title #[$num]",
        content = s"Test post content. $num")
    )
    posts.map(post => await(postRepo.save(post).run))
  }

  def seedCommentDatabase = {
    val comments = List.range(1, 11).map(num =>
      model.Comment(id = Some(num),
        content = s"Test comment. $num",
        postId = 1))
    comments.map(comment => await(commentRepo.save(comment).run))
  }

  override def beforeEach() {
    clean()
    dropDb()
    initDb()
    seedPostDatabase
    seedCommentDatabase
  }

  override protected def afterEach() {
    dropDb()
    initDb()
  }
}