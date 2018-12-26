package app

import common.graphql.UserContext
import common.shapes.ServerModule
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import graphql.schema.CounterSchema
import guice.CounterBinding
import repositories.CounterSchemaInitializer
import sangria.schema.Field

import scala.collection.mutable

class CounterModule extends ServerModule {

  lazy val counterSchema: CounterSchema = inject[CounterSchema]
  lazy val counterSchemaInitializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet(counterSchemaInitializer)
  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(counterSchema.queries: _*)
  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(counterSchema.mutations: _*)
  override lazy val subscriptions: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(counterSchema.subscriptions: _*)

  bindings = new CounterBinding
}