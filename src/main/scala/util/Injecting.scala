package util

import java.lang.annotation.Annotation

import com.google.inject.{Guice, Injector}
import net.codingwell.scalaguice.InjectorExtensions._
import util.InjectionModules.Modules

trait Injecting {
  val injector: Injector = Injecting.injector

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }
}

object Injecting {
  val injector = Guice.createInjector(Modules)
}