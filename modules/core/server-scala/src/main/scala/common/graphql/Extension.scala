package common.graphql

import sangria.ast
import sangria.schema.AstSchemaBuilder

case class Extension[Ctx](document: ast.Document, builder: AstSchemaBuilder[Ctx] = AstSchemaBuilder.default[Ctx])