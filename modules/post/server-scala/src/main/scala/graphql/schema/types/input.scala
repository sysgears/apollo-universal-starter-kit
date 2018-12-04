package graphql.schema.types

import model._
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType}
import sangria.schema.InputObjectType

object input {

  implicit val addPostInput: InputObjectType[AddPostInput] = deriveInputObjectType(InputObjectTypeName("AddPostInput"))
  implicit val editPostInput: InputObjectType[EditPostInput] = deriveInputObjectType(InputObjectTypeName("EditPostInput"))
  implicit val addCommentInput: InputObjectType[AddCommentInput] = deriveInputObjectType(InputObjectTypeName("AddCommentInput"))
  implicit val editCommentInput: InputObjectType[EditCommentInput] = deriveInputObjectType(InputObjectTypeName("EditCommentInput"))
  implicit val deleteCommentInput: InputObjectType[DeleteCommentInput] = deriveInputObjectType(InputObjectTypeName("DeleteCommentInput"))
}
