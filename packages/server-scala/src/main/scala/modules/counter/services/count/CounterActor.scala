package modules.counter.services.count

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.ActorNamed
import common.DatabaseExecutor._
import common.errors.InternalServerError
import modules.counter.models.Counter
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}

import scala.concurrent.{ExecutionContext, Future}

object CounterActor extends ActorNamed {

  final val name = "CounterActor"

  object GetAmount

  case class IncrementAndGet(amount: Int)

}

class CounterActor @Inject()(counterRepository: Repository[Counter, Int])
                            (implicit executionContext: ExecutionContext) extends Actor
  with ActorLogging {
  private val defaultId = 1

  override def receive: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      (for {
        optionCounter <- counterRepository.findOne(defaultId).run
        counter <- if (optionCounter.nonEmpty) Future(optionCounter.get) else Future.failed(InternalServerError())
        updatedCounter <- counterRepository.update(counter.copy(amount = counter.amount + incrementAndGet.amount)).run
      } yield updatedCounter).pipeTo(sender())

    case GetAmount =>
      (for {
        optionCounter <- counterRepository.findOne(defaultId).run
        counter <- if (optionCounter.nonEmpty) Future(optionCounter.get) else Future.failed(InternalServerError())
      } yield counter).pipeTo(sender())
  }
}