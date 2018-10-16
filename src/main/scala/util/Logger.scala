package util

import org.slf4j.LoggerFactory

trait Logger {
  val log = LoggerFactory.getLogger(this.getClass.getName)
}