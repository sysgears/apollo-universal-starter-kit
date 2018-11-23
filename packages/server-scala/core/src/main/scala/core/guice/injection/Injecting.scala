package core.guice.injection

import java.lang.annotation.Annotation

import com.google.inject.{Guice, Injector}
import core.loaders.ModuleLoader.guiceModules
import net.codingwell.scalaguice.InjectorExtensions._

import scala.collection.JavaConverters._

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
  val injector: Injector = Guice.createInjector(guiceModules.asJava)
}