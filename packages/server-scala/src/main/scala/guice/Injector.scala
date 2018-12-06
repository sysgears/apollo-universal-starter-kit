package guice

import java.lang.annotation.Annotation

import modulesinfo.ModulesInfo
import com.google.inject.{Guice, Injector}
import core.guice.CoreInjector
import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import net.codingwell.scalaguice.InjectorExtensions._
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

import scala.collection.JavaConverters._

object Injector {

  val modulesPaths: List[String] = ModulesInfo.modules.toList

  val guiceModules: Seq[ScalaModule] = InitializedClasses[ScalaModule](
    FilteredClasses(
      FoundClasses(List(".", "../../modules/core/server-scala") ++ modulesPaths),
      scalaModuleFilter
    )
  ).retrieve

  val injector: Injector = {
    CoreInjector.injector = Guice.createInjector(guiceModules.asJava)
    CoreInjector.injector
  }

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }

  def scalaModuleFilter(classInfo: ClassInfo): Boolean = classInfo.implements(classOf[ScalaModule].getName)
}