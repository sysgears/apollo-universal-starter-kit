package core.guice

import java.lang.annotation.Annotation

import com.google.inject.Injector
import net.codingwell.scalaguice.InjectorExtensions._

trait Injecting {

  lazy val injector: Injector = Injector.injector

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }
}