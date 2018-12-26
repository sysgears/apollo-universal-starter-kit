package core.services.conf

/**
  * Contains a type-alias for the `.env` type
  */
package object dotenv {
  type `.env` = Map[String, String]
  object `.env` {
    def empty: `.env` = Map.empty[String, String]
    def apply(tuples: (String, String)*): `.env` = Map(tuples:_*)
  }
}
