package actors.counter

import actors.counter.CounterPersistentActor.{GetAmount, IncrementAndGet, Reset}
import akka.actor.{ActorLogging, Props}
import akka.persistence.{PersistentActor, SnapshotOffer, SnapshotSelectionCriteria}
import util.Named

object CounterPersistentActor extends Named {

  object GetAmount

  object Reset

  case class IncrementAndGet(amount: Int)

  def props = Props(new CounterPersistentActor)

  override final val name = "PersistentCounterActor"
}

class CounterPersistentActor extends PersistentActor with ActorLogging {

  override def preStart {
    log.info(s"Actor [$self] starting ...")
    self ! Reset
  }

  override def persistenceId: String = "counter-persistent"

  private var counter: Int = 0

  override def receiveRecover: Receive = {
    case SnapshotOffer(_, snapshot: Int) => {
      log.info(s"Recovered snapshot [$snapshot]")
      counter = snapshot
    }
  }

  override def receiveCommand: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [$incrementAndGet]")
      counter += incrementAndGet.amount
      saveSnapshot(counter)
      sender ! counter

    case GetAmount => sender ! counter

    case Reset => {
      log.info(s"Reseting state of Actor [$self]...")
      deleteSnapshots(SnapshotSelectionCriteria())
      resetCounter
    }
  }

  private def resetCounter = counter = 0

  override def postStop {
    log.info(s"Actor [$self] has stopped")
  }

  override def postRestart(reason: Throwable) {
    log.info(s"Actor [$self] has restarted due to [$reason]")
  }
}