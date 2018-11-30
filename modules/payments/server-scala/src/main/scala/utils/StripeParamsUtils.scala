package utils

import java.util
import scala.collection.JavaConverters._

/**
  * Adds helpers to conveniently build java.util.Maps with params for Stripe queries via Scala tuples.
  */
trait StripeParamsUtils {
  /**
    * A shortcut to build param object Map
    */
  def obj(tuples: (String, AnyRef)*): util.Map[String, AnyRef] = Map[String, AnyRef](tuples: _*).asJava

  /**
    * A shortcut to build param sequence Map
    */
  def seq(seq: AnyRef*): util.Map[String, AnyRef] = Map[String, AnyRef](seq.zipWithIndex.map { case (value, idx) => (idx.toString, value) }: _*).asJava
}
