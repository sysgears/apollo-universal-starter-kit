package modules.graphql.types

import java.util.Date

import core.graphql.{GraphQLContext, GraphQLSchema}
import modules.graphql.types.GraphQLTypes.{dateTimeType, dateType, timeType}
import modules.graphql.types.SyncDate.{getDate, setDate}
import sangria.schema.{Argument, Field}

class GraphQLTypesSchema extends GraphQLSchema {

  override def queries: List[Field[GraphQLContext, Unit]] = List(
    Field(
      name = "dateTime",
      fieldType = dateTimeType,
      resolve = _ => getDate
    ),
    Field(
      name = "date",
      fieldType = dateType,
      resolve = _ => getDate
    ),
    Field(
      name = "time",
      fieldType = timeType,
      resolve = _ => getDate
    )
  )

  override def mutations: List[Field[GraphQLContext, Unit]] = List(
    Field(
      name = "setDateTime",
      fieldType = dateTimeType,
      arguments = Argument(name = "dateTime", argumentType = dateTimeType) :: Nil,
      resolve = sc => {
        val dateTime = sc.args.arg[Date]("dateTime")
        setDate(dateTime)
        dateTime
      }
    ),
    Field(
      name = "setDate",
      fieldType = dateTimeType,
      arguments = Argument(name = "date", argumentType = dateType) :: Nil,
      resolve = sc => {
        val date = sc.args.arg[Date]("date")
        setDate(date)
        date
      }
    ),
    Field(
      name = "setTime",
      fieldType = timeType,
      arguments = Argument(name = "time", argumentType = timeType) :: Nil,
      resolve = sc => {
        val time = sc.args.arg[Date]("time")
        setDate(time)
        time
      }
    )
  )

  override def subscriptions: List[Field[GraphQLContext, Unit]] = List.empty
}

object SyncDate {
  private val date = new Date()

  def getDate: Date = {
    new Date(date.getTime)
  }

  def setDate(newDate: Date): Unit = this.synchronized {
    date.setTime(newDate.getTime)
  }
}