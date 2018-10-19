package actors.counter

import actors.counter.CounterPersistentActor.{GetAmount, IncrementAndGet, Init}
import akka.actor.{ActorLogging, Props}
import akka.persistence._
import core.services.persistence.PersistenceCleanup
import util.Named

object CounterPersistentActor extends Named {

  object GetAmount

  case class Init(amount: Int)

  case class IncrementAndGet(amount: Int)

  def props(persistenceCleanup: PersistenceCleanup) = Props(new CounterPersistentActor(persistenceCleanup))

  override final val name = "CounterPersistentActor"
}

class CounterPersistentActor(persistenceCleanup: PersistenceCleanup) extends PersistentActor with ActorLogging {

  override def preStart() {
    log.info(s"Actor [$self] starting ...")
    persistenceCleanup.deleteStorageLocations()
  }

  override def persistenceId: String = CounterPersistentActor.name

  private var counter: Int = 0

  override def receiveRecover: Receive = {
    case SnapshotOffer(_, snapshot: Int) => counter = snapshot

    case RecoveryCompleted => log.info(s"Counter recovery completed. Current state: [$counter]")
  }

  override def receiveCommand: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      counter += incrementAndGet.amount
      saveSnapshot(counter)
      sender ! counter

    case GetAmount => sender ! counter

    case init: Init =>
      counter = init.amount
      saveSnapshot(counter)
      sender ! counter

    case DeleteSnapshotsSuccess(_) => log.info("Snapshots successfully deleted")

    case DeleteMessagesSuccess(_) => log.info("Messages successfully deleted")
  }

  override def postStop() {
    log.info(s"Actor [$self] stopped")
  }

  override def postRestart(reason: Throwable) {
    log.info(s"Actor [$self] has restarted due to [$reason]")
  }
}