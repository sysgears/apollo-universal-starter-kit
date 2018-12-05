package core.loaders

import common.Logger
import common.classes.{ClassFilter, ClassFinder, ClassInstantiator}
import core.controllers.AkkaRoute
import core.graphql.GraphQLSchema
import core.guice.injection.Injecting.injector
import core.slick.SchemaInitializer
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

object ModuleLoader extends Logger
  with ClassFinder
  with ClassFilter
  with ClassInstantiator {

  private val projectClasses = findClasses
  private val ignoreModuleName = classOf[IgnoreModule].getSimpleName

  val guiceModules: List[ScalaModule] = getInstances[ScalaModule](classOf[ScalaModule].getName)

  lazy val akkaRouteModules: List[AkkaRoute] = getInjectedInstances[AkkaRoute](classOf[AkkaRoute].getName)
  lazy val graphQLSchemaModules: List[GraphQLSchema] = getInjectedInstances[GraphQLSchema](classOf[GraphQLSchema].getName)
  lazy val slickSchemaModules: List[SchemaInitializer[_]] = getInjectedInstances[SchemaInitializer[_]](classOf[SchemaInitializer[_]].getName)

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

  private def getInjectedInstances[T](className: String) = {
    val filteredClasses = filterClasses(projectClasses, filter(className))
    instatiateClasses(filteredClasses, init = {
      clazz =>
        println(s"Instantiate a class with inject: ${clazz.getName}")
        injector.getInstance(clazz).asInstanceOf[T]
    })
  }
}