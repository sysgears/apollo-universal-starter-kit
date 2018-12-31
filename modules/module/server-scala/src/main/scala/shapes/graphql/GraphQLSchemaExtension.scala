package shapes.graphql

import sangria.ast
import sangria.schema.AstSchemaBuilder

trait GraphQLSchemaExtension[Ctx] {
  val document: ast.Document
  val builder: AstSchemaBuilder[Ctx]
}