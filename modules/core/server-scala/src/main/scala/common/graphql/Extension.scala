package common.graphql

import sangria.ast
import sangria.schema.AstSchemaBuilder
import shapes.graphql.GraphQLSchemaExtension

case class Extension[Ctx](
    override val document: ast.Document,
    override val builder: AstSchemaBuilder[Ctx] = AstSchemaBuilder.default[Ctx]
) extends GraphQLSchemaExtension[Ctx]
