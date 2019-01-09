package model

case class FilterUserInput(
    searchText: Option[String], // search by username or email
    role: Option[String], // filter by role
    isActive: Option[Boolean]
) // filter by isActive
