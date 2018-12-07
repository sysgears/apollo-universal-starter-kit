package core.guice

import java.lang.annotation.Annotation

import com.google.inject.{Guice, Injector}
import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import net.codingwell.scalaguice.InjectorExtensions._
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

import scala.collection.JavaConverters._

object Injector {

  val modulesPaths: Set[String] = findModulesPaths(InitializedClasses[Any](
    FilteredClasses(
      FoundClasses(List(".")),
      filter = classInfo => classInfo.name.contains("ModulesInfo") && !classInfo.name.contains("$")
    ),
    initializer = Some(clazz => clazz.getMethod("modules").invoke(this))
  ).retrieve
    .asInstanceOf[List[List[String]]]
    .flatten
  )

  val guiceModules: Seq[ScalaModule] = InitializedClasses[ScalaModule](
    FilteredClasses(
      FoundClasses(List(".") ++ modulesPaths),
      scalaModuleFilter
    )
  ).retrieve

  val injector: Injector = Guice.createInjector(guiceModules.asJava)

  def inject[T: Manifest]: T = {
    injector.instance[T]
  }

  def inject[T: Manifest](ann: Annotation): T = {
    injector.instance[T](ann)
  }

  /**
    * Recursively finds paths to connected modules and their submodules.
    *
    * @param paths paths to 'first-level' connected modules
    * @return set of paths to all connected modules within the application
    */
  private def findModulesPaths(paths: List[String]): Set[String] = {
    if (paths.nonEmpty) {
      paths ++
        findModulesPaths(
          InitializedClasses[Any](
            FilteredClasses(
              FoundClasses(paths),
              filter = classInfo => classInfo.name.contains("ModulesInfo") && !classInfo.name.contains("$")
            ),
            initializer = Some(clazz => clazz.getMethod("modules").invoke(this))
          ).retrieve
            .asInstanceOf[List[List[String]]]
            .flatten.map(_.replace("../../", "../../modules/"))
        )
    } else paths
  }.toSet

  private def scalaModuleFilter(classInfo: ClassInfo): Boolean = classInfo.implements(classOf[ScalaModule].getName)
}
