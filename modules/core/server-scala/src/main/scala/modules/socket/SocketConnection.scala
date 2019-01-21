package modules.socket

import monix.execution.Cancelable

import scala.collection.concurrent.TrieMap

class SocketConnection {

  private[this] val subscriptions: TrieMap[String, Cancelable] = TrieMap.empty[String, Cancelable]

  /** Adds a new operationId/cancelable pair to subscriptions.
    *  If the subscriptions already contains a
    *  mapping for the operationId, it will be overridden by the new cancelable.
    */
  def add(id: String, cancelable: Cancelable): Unit = {
    this.subscriptions.update(id, cancelable)
  }

  def cancel(id: String): Unit = {
    this.subscriptions.get(id).foreach(_.cancel())
  }

  def size: Int = {
    this.subscriptions.size
  }
}

object SocketConnection {
  def apply: SocketConnection = new SocketConnection()
}
