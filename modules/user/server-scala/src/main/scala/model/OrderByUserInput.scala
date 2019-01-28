package model

case class OrderByUserInput(
    column: Option[String], // id | username | role | isActive | email
    order: Option[String]
) // asc | desc
