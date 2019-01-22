package services.count

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.ActorNamed
import common.implicits.RichDBIO._
import common.errors.InternalServerError
import common.implicits.RichFuture._
import models.Counter
import services.count.CounterActor.{GetAmount, IncrementAndGet}
import slick.dbio.DBIO

import scala.concurrent.ExecutionContext

object CounterActor extends ActorNamed {

  final val name = "CounterActor"

  object GetAmount

  case class IncrementAndGet(amount: Int)

}

class CounterActor @Inject()(counterRepository: Repository[Counter, Int])(implicit executionContext: ExecutionContext)
  extends Actor
  with ActorLogging {
  private val defaultId = 1

  override def receive: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.debug(s"Received message: [ $incrementAndGet ]")
      counterRepository
        .executeTransactionally(
          for {
            optionCounter <- counterRepository.findOne(defaultId)
            counter <- if (optionCounter.nonEmpty) DBIO.successful(optionCounter.get)
            else DBIO.failed(InternalServerError())
            updatedCounter <- counterRepository.update(counter.copy(amount = counter.amount + incrementAndGet.amount))
          } yield updatedCounter
        )
        .run
        .pipeTo(sender)

    case GetAmount => counterRepository.findOne(defaultId).run.failOnNone(InternalServerError()).pipeTo(sender)
  }
}
