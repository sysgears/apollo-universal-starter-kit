package core

import akka.http.scaladsl.Http.ServerBinding

import scala.concurrent.{ExecutionContext, Future}

trait AppInitialization {

  def withActionsBefore(actionsBefore: => Seq[Future[Unit]])
                       (bindAndHandle: => Future[ServerBinding])
                       (implicit executionContext: ExecutionContext): Future[ServerBinding] = for {
    _ <- Future.sequence(actionsBefore)
    serverBinding <- bindAndHandle
  } yield serverBinding
}