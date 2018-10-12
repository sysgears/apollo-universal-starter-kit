package actors.counter

import actors.counter.CounterPersistentActor.{GetAmount, IncrementAndGet, Init}
import akka.actor.{ActorLogging, Props}
import akka.persistence._
import util.Named

object CounterPersistentActor extends Named {

  object GetAmount

  case class Init(amount: Int)

  case class IncrementAndGet(amount: Int)

  def props = Props(new CounterPersistentActor)

  override final val name = "CounterPersistentActor"
}

class CounterPersistentActor extends PersistentActor with ActorLogging {

  override def preStart {
    log.info(s"Actor [$self] starting ...")
    deleteSnapshots(SnapshotSelectionCriteria())
  }

  override def persistenceId: String = CounterPersistentActor.name

  private var counter: Int = 0

  override def receiveRecover: Receive = {
    case SnapshotOffer(metadata, snapshot: Int) => counter = snapshot

    case RecoveryCompleted => log.info(s"Counter recovery complited. Current state: [$counter]")
  }

  override def receiveCommand: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      increment(incrementAndGet.amount)
      saveSnapshot(counter)
      sender ! counter

    case GetAmount => sender ! counter

    case init: Init =>
      initCounter(init.amount)
      saveSnapshot(counter)
      sender ! counter

    case DeleteSnapshotsSuccess(criteria) => log.info("Snapshots successfully deleted")

    case DeleteMessagesSuccess(toSequenceNr) => log.info("Messages successfully deleted")
  }

  private def initCounter(amount: Int) = counter = amount

  private def increment(amount: Int) = counter += amount

  override def postStop {
    log.info(s"Execution stopped")
  }

  override def postRestart(reason: Throwable) {
    log.info(s"Actor [$self] has restarted due to [$reason]")
  }
}