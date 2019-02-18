package modules.socket

import monix.execution.Cancelable

import scala.collection.concurrent.TrieMap

case class GraphQLSubscriptions() {

  private[this] val subscriptions: TrieMap[String, Cancelable] = TrieMap.empty[String, Cancelable]

  private[this] var wsClosed = false

  /** Adds a new operationId/cancelable pair to subscriptions.
    *  If the subscriptions already contains a
    *  mapping for the operationId, it will be overridden by the new cancelable.
    */
  def add(id: String, cancelable: Cancelable): Unit = synchronized {
    if (!wsClosed) this.subscriptions.update(id, cancelable)
    else cancelable.cancel
  }

  def cancel(id: String): Unit = {
    this.subscriptions.get(id).foreach(_.cancel)
  }

  def cancelAll(): Unit = synchronized {
    this.subscriptions.foreach(_._2.cancel)
    wsClosed = true
  }

  def size: Int = {
    this.subscriptions.size
  }
}
