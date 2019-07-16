package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.publisher.{Event, PubSubService}
import common.{InputUnmarshallerGenerator, Logger}
import graphql.resolver.ChatResolver
import javax.inject.Inject
import models.{AddMessageInput, _}
import sangria.macros.derive.{ObjectTypeName, deriveObjectType, _}
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, IntType, ObjectType, OptionInputType, OptionType, _}
import sangria.streaming.akkaStreams._
import services.publisher.EndCursor
import common.publisher.RichPubSubService._

import scala.concurrent.ExecutionContext

class ChatSchema @Inject()(
    chatResolver: ChatResolver,
    implicit val materializer: ActorMaterializer,
    implicit val messagePubSubService: PubSubService[Event[Message]],
    implicit val actorSystem: ActorSystem,
    implicit val executionContext: ExecutionContext
) extends InputUnmarshallerGenerator
  with Logger {

  implicit val addMessageInputUnmarshaller: FromInput[AddMessageInput] = inputUnmarshaller {
    input =>
      AddMessageInput(
        text = input("text").asInstanceOf[String],
        userId = input("userId").asInstanceOf[Option[Int]],
        uuid = input("uuid").asInstanceOf[Option[String]],
        quotedId = input("quotedId").asInstanceOf[Option[Int]]
      )
  }

  implicit val editMessageInputUnmarshaller: FromInput[EditMessageInput] = inputUnmarshaller {
    input =>
      EditMessageInput(
        id = input("id").asInstanceOf[Int],
        text = input("text").asInstanceOf[String],
        userId = input("userId").asInstanceOf[Option[Int]]
      )
  }

  object Types {

    implicit val UploadAttachment: ScalarType[Unit] =
      new ScalarType[Unit](
        name = "UploadAttachment",
        coerceOutput = (_, _) => Unit,
        coerceUserInput = _ => Right(Unit),
        coerceInput = _ => Right(Unit)
      )

    implicit val QuotedMessage: ObjectType[Unit, QuotedMessage] = deriveObjectType(ObjectTypeName("QuotedMessage"))
    implicit val Message: ObjectType[Unit, Message] = deriveObjectType(
      ObjectTypeName("Message"),
      AddFields(
        Field(
          name = "quotedMessage",
          OptionType(QuotedMessage),
          resolve = sc => chatResolver.findQuotedMessage(sc.value.quotedId)
        )
      )
    )
    implicit val MessageEdges: ObjectType[Unit, MessageEdges] = deriveObjectType(ObjectTypeName("MessageEdges"))
    implicit val MessagePageInfo: ObjectType[Unit, MessagePageInfo] = deriveObjectType(
      ObjectTypeName("MessagePageInfo")
    )
    implicit val Messages: ObjectType[UserContext, Messages] = deriveObjectType(ObjectTypeName("Messages"))
    implicit val AddMessageInput: InputObjectType[AddMessageInput] = InputObjectType[AddMessageInput](
      name = "AddMessageInput",
      fields = List(
        InputField(name = "text", fieldType = StringType),
        InputField(name = "userId", fieldType = OptionInputType(IntType)),
        InputField(name = "uuid", fieldType = OptionInputType(StringType)),
        InputField(name = "quotedId", fieldType = OptionInputType(IntType)),
        InputField(name = "attachment", fieldType = OptionInputType(UploadAttachment))
      )
    )

    implicit val EditMessageInput: InputObjectType[EditMessageInput] =
      deriveInputObjectType[EditMessageInput](InputObjectTypeName("EditMessageInput"))

    implicit val UpdateMessagesPayload: ObjectType[Unit, UpdateMessagesPayload] = deriveObjectType(
      ObjectTypeName("UpdateMessagesPayload")
    )
  }

  object Names {

    final val MESSAGE = "message"
    final val MESSAGES = "messages"

    final val ADD_MESSAGE = "addMessage"
    final val DELETE_MESSAGE = "deleteMessage"
    final val EDIT_MESSAGE = "editMessage"

    final val MESSAGES_UPDATED = "messagesUpdated"
  }

  import Names._

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = ADD_MESSAGE,
      fieldType = Types.Message,
      arguments = List(
        Argument(name = "input", argumentType = Types.AddMessageInput)
      ),
      resolve = sc => chatResolver.addMessage(sc.args.arg[AddMessageInput]("input"), sc.ctx.filesData).pub(ADD_MESSAGE)
    ),
    Field(
      name = DELETE_MESSAGE,
      fieldType = OptionType(Types.Message),
      arguments = List(
        Argument(name = "id", argumentType = IntType)
      ),
      resolve = sc => chatResolver.deleteMessage(sc.args.arg[Int]("id")).pub(DELETE_MESSAGE)
    ),
    Field(
      name = EDIT_MESSAGE,
      fieldType = Types.Message,
      arguments = List(
        Argument(name = "input", argumentType = Types.EditMessageInput)
      ),
      resolve = sc => chatResolver.editMessage(sc.args.arg[EditMessageInput]("input")).pub(EDIT_MESSAGE)
    )
  )

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = MESSAGES,
      fieldType = Types.Messages,
      arguments = List(
        Argument(name = "limit", argumentType = IntType),
        Argument(name = "after", argumentType = IntType)
      ),
      resolve = sc =>
        chatResolver.messages(
          sc.args.arg[Int]("limit"),
          sc.args.arg[Int]("after")
      )
    ),
    Field(
      name = MESSAGE,
      fieldType = OptionType(Types.Message),
      arguments = List(
        Argument(name = "id", argumentType = IntType)
      ),
      resolve = sc => chatResolver.message(sc.args.arg[Int]("id"))
    )
  )

  def subscriptions: List[Field[UserContext, Unit]] = List(
    Field.subs(
      name = Names.MESSAGES_UPDATED,
      fieldType = OptionType(Types.UpdateMessagesPayload),
      arguments = Argument(name = "endCursor", argumentType = IntType) :: Nil,
      resolve = sc => {
        val endCursor = sc.args.arg[Int]("endCursor")
        messagePubSubService
          .subscribe(Seq(ADD_MESSAGE, EDIT_MESSAGE, DELETE_MESSAGE), Seq(EndCursor(endCursor)))(sc.ctx)
          .map(
            action =>
              action.map(event => {
                UpdateMessagesPayload(mutation = event.name, id = Some(event.element.id), node = event.element)
              })
          )
      }
    )
  )
}
