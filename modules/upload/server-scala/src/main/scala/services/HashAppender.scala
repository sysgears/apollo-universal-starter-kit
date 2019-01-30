package services

import java.util.UUID

trait HashAppender {

  def append(str: String): String
}

class HashAppenderImpl extends HashAppender {

  override def append(str: String): String = UUID.randomUUID.toString.take(9) + str
}
