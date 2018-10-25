package modules.contact.graphql.schema

import core.graphql.GraphQLSchema
import javax.inject.Inject
import modules.contact.graphql.resolvers.ContactResolver
import modules.contact.models.{Contact, ContactPayload}
import sangria.macros.derive.{InputObjectTypeName, ObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, ObjectType}
import util.{InputUnmarshallerGenerator, Logger}

class ContactSchema @Inject()(contactResolver: ContactResolver) extends GraphQLSchema
  with InputUnmarshallerGenerator
  with Logger {

  implicit val contactInput: InputObjectType[Contact] = deriveInputObjectType[Contact](InputObjectTypeName("ContactInput"))
  implicit val contactInputUnmarshaller: FromInput[Contact] = inputUnmarshaller {
    input =>
      Contact(
        name = input("name").asInstanceOf[String],
        email = input("email").asInstanceOf[String],
        content = input("content").asInstanceOf[String],
      )
  }

  implicit val contactPayload: ObjectType[Unit, ContactPayload] = deriveObjectType(ObjectTypeName("ContactPayload"))

  override def mutations: List[Field[Unit, Unit]] = List(
    Field(
      name = "contact",
      fieldType = contactPayload,
      arguments = List(Argument("input", contactInput)),
      resolve = sc => contactResolver.sendMail(sc.args.arg[Contact]("input"))
    )
  )
}