package graphql.resolvers

import model.Tokens

import scala.concurrent.Future

trait TokensResolver {
  def refreshTokens(refreshToken: String): Future[Tokens]
}