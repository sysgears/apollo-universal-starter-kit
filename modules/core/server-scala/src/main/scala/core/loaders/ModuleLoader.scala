package core.loaders

import common.Logger
import common.classes.{ClassFilter, ClassFinder, ClassInstantiator}
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

object ModuleLoader extends Logger
  with ClassFinder
  with ClassFilter
  with ClassInstantiator {

  private val projectClasses = findClasses
  private val ignoreModuleName = classOf[IgnoreModule].getSimpleName

  val guiceModules: List[ScalaModule] = getInstances[ScalaModule](classOf[ScalaModule].getName)

  private def filter(className: String)(clazz: ClassInfo) = {
    clazz.implements(className) && !clazz.annotations.exists(_.descriptor.endsWith(s"$ignoreModuleName;"))
  }

  private def getInstances[T](className: String) = {
    val filteredClasses = filterClasses(projectClasses, filter(className))
    instatiateClasses(filteredClasses, init = {
      clazz =>
        println(s"Instantiate a class: ${clazz.getName}")
        clazz.newInstance.asInstanceOf[T]
    })
  }
}