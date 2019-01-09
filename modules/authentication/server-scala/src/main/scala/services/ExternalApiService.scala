package services

import com.github.scribejava.core.oauth.OAuth20Service
import spray.json.RootJsonFormat

import scala.concurrent.{ExecutionContext, Future}

trait ExternalApiService {
  def getUserInfo[T](code: String, userInfoUrl: String, service: OAuth20Service)(
      implicit formatter: RootJsonFormat[T],
      executionContext: ExecutionContext
  ): Future[T]
}
