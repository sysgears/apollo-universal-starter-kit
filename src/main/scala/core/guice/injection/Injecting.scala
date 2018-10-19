package core.guice.injection

import java.lang.annotation.Annotation

import _root_.util.ReflectionHelper.getInstances
import com.google.inject.{Guice, Injector}
import com.typesafe.config.ConfigFactory
import net.codingwell.scalaguice.InjectorExtensions._
import net.codingwell.scalaguice.ScalaModule

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

  val injector: Injector = Guice.createInjector {
    getInstances[ScalaModule](classesNames("guice.modules")).asJava
  }

  def loadClasses[T](propertyName: String): List[T] = {
    classesNames(propertyName).map {
      className =>
        injector.getInstance(classLoader.loadClass(className)).asInstanceOf[T]
    }
  }

  private val classLoader = getClass.getClassLoader

  private def classesNames(propertyName: String): List[String] = {
    ConfigFactory.load.getList(propertyName).asScala.map(_.render.drop(1).dropRight(1)).toList
  }
}