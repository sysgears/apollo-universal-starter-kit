package core.guice.injection

import java.lang.annotation.Annotation

import com.google.inject.{Guice, Injector}
import core.loader.ServerModuleFinder._
import net.codingwell.scalaguice.InjectorExtensions._
import core.guice.injection.Injecting._
import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

import scala.collection.JavaConverters._

trait Injecting {

  def initialize(paths: List[String]): Unit = {
    Injecting.paths = paths
  }

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }
}

object Injecting {
  lazy val modulesPaths: Set[String] = findModulesPaths(paths)
  lazy val injector: Injector = {

    val guiceModules: Seq[ScalaModule] = InitializedClasses[ScalaModule](
      FilteredClasses(
        FoundClasses(paths ++ modulesPaths.toList),
        scalaModuleFilter
      )
    ).retrieve
    Guice.createInjector(guiceModules.asJava)
  }

  private var paths: List[String] = List(".")

  private def scalaModuleFilter(classInfo: ClassInfo): Boolean = classInfo.implements(classOf[ScalaModule].getName)
}