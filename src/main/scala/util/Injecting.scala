package util

import com.google.inject.{Guice, Injector}
import util.InjectionModules.Modules
import net.codingwell.scalaguice.InjectorExtensions._
import scala.reflect.ClassTag

trait Injecting {
  val injector: Injector = Injecting.injector

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }
}

object Injecting {
  val injector = Guice.createInjector(Modules)
}