package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import graphql.resolver.ChatResolver
import javax.inject.Inject
import models.{AddMessageInput, _}
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema._

import scala.concurrent.ExecutionContext

class ChatSchema @Inject()(
    chatResolver: ChatResolver,
    implicit val materializer: ActorMaterializer,
    actorSystem: ActorSystem,
    executionContext: ExecutionContext
) extends InputUnmarshallerGenerator
  with Logger {

  implicit val addMessageInputUnmarshaller: FromInput[AddMessageInput] = inputUnmarshaller {
    input =>
      AddMessageInput(
        text = input("text").asInstanceOf[String],
        userId = input("userId").asInstanceOf[Option[Int]],
        uuid = input("uuid").asInstanceOf[Option[String]],
        quotedId = input("quotedId").asInstanceOf[Option[Int]],
        attachment = input("attachment").asInstanceOf[Option[ScalarType[Unit]]]
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
          resolve = sc => chatResolver.findQuotedMessage(sc.args.arg[Int]("id"))
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
  }

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addMessage",
      fieldType = Types.Message,
      arguments = List(
        Argument(name = "input", argumentType = Types.AddMessageInput)
      ),
      resolve = sc => chatResolver.addMessage(sc.args.arg[AddMessageInput]("input"), sc.ctx.filesData)
    ),
    Field(
      name = "deleteMessage",
      fieldType = OptionType(Types.Message),
      arguments = List(
        Argument(name = "id", argumentType = IntType)
      ),
      resolve = sc => chatResolver.deleteMessage(sc.args.arg[Int]("id"))
    ),
    Field(
      name = "editMessage",
      fieldType = Types.Message,
      arguments = List(
        Argument(name = "input", argumentType = Types.EditMessageInput)
      ),
      resolve = sc => chatResolver.editMessage(sc.args.arg[EditMessageInput]("input"))
    )
  )

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "messages",
      fieldType = OptionType(Types.Messages),
      arguments = List(
        Argument(name = "limit", argumentType = IntType),
        Argument(name = "after", argumentType = IntType),
      ),
      resolve = sc =>
        chatResolver.messages(
          sc.args.arg[Int]("limit"),
          sc.args.arg[Int]("after")
      )
    ),
    Field(
      name = "message",
      fieldType = OptionType(Types.Message),
      arguments = List(
        Argument(name = "id", argumentType = IntType)
      ),
      resolve = sc => chatResolver.message(sc.args.arg[Int]("id"))
    )
  )
}
