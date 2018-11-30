package model

/**
  * An object defining pagination parameters.
  *
  * @param offset number of elements to skip
  * @param limit number of items to take from the database
  */
case class PaginationParams(offset: Int, limit: Int)
