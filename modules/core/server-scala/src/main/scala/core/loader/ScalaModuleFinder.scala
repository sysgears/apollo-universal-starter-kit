package core.loader

import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

case class ScalaModuleFinder(moduleFinder: ModuleFinder) {

  val guiceModules: Seq[ScalaModule] = InitializedClasses[ScalaModule](
    FilteredClasses(
      FoundClasses(moduleFinder.paths ++ moduleFinder.modulesPaths.toList),
      scalaModuleFilter
    )
  ).retrieve

  private def scalaModuleFilter(classInfo: ClassInfo): Boolean = classInfo.implements(classOf[ScalaModule].getName)
}