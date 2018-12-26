package services

import com.github.scribejava.core.model.{OAuthRequest, Verb}
import com.github.scribejava.core.oauth.OAuth20Service
import spray.json._

import scala.concurrent.{ExecutionContext, Future}

class ExternalApiServiceImpl extends ExternalApiService {

  def getUserInfo[T](code: String, userInfoUrl: String, service: OAuth20Service)
                    (implicit formatter: RootJsonFormat[T], executionContext: ExecutionContext): Future[T] = for {
    oauthAccessToken <- Future(service.getAccessToken(code))
    request = new OAuthRequest(Verb.GET, userInfoUrl)
    _ = service.signRequest(oauthAccessToken, request)
    response <- Future(service.execute(request))
  } yield response.getBody.parseJson.convertTo[T]
}