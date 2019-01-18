package modules.socket

import java.util.concurrent.ConcurrentHashMap

import monix.execution.Cancelable

class SocketConnection {

  //TODO Try to use monix.Atomic
  private[this] val subscriptions: java.util.concurrent.ConcurrentHashMap[String, Cancelable]  = new ConcurrentHashMap[String, Cancelable]()

  //TODO Resubscribe if id exist
  def add(operationId: String, cancelable: Cancelable): Unit = {
    this.subscriptions.put(operationId, cancelable)
  }

  //TODO Remove cancelable from subscription
  def cancel(operationId: String): Unit = {
    this.subscriptions.get(operationId).cancel()
  }

  def size: Int = {
    this.subscriptions.size
  }
}

object SocketConnection {
  def apply: SocketConnection = new SocketConnection()
}
