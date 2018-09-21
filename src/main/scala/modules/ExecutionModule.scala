package modules

import com.google.inject.{AbstractModule, Provides}
import net.codingwell.scalaguice.ScalaModule

import scala.concurrent.ExecutionContext

class ExecutionModule extends AbstractModule with ScalaModule {

  @Provides
  def executionContext: ExecutionContext = {
    ExecutionContext.Implicits.global
  }
}
