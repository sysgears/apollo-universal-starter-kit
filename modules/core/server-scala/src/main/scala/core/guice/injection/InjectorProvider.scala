package core.guice.injection

import java.lang.annotation.Annotation
import net.codingwell.scalaguice.InjectorExtensions._

import com.google.inject.{Inject, Injector}

object InjectorProvider {

  @Inject
  var injector: Injector = _

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }
}