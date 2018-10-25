package core.loaders

import java.io.File

import core.controllers.AkkaRoute
import core.graphql.GraphQLSchema
import core.guice.injection.Injecting.injector
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassFinder
import util.Logger

object ModuleLoader extends Logger {

  private val classLoader = getClass.getClassLoader
  private val classes = ClassFinder(List(".").map(new File(_))).getClasses()
  private val ignoreModuleName = classOf[IgnoreModule].getSimpleName

  val guiceModules: List[ScalaModule] = instantiateClasses[ScalaModule](classOf[ScalaModule].getName)

  lazy val akkaRouteModules: List[AkkaRoute] = instantiateClassesWithInject[AkkaRoute](classOf[AkkaRoute].getName)
  lazy val graphQLSchemaModules: List[GraphQLSchema] = instantiateClassesWithInject[GraphQLSchema](classOf[GraphQLSchema].getName)

  private def instantiateClasses[T](classType: String) = {
    loadClasses(classType).map {
      clazz =>
        log.info(s"Instantiate a class: ${clazz.getName}")
        clazz.newInstance.asInstanceOf[T]
    }
  }

  private def instantiateClassesWithInject[T](classType: String) = {
    loadClasses(classType).map {
      clazz =>
        log.info(s"Instantiate a class with inject: ${clazz.getName}")
        injector.getInstance(clazz).asInstanceOf[T]
    }
  }

  private def loadClasses(classType: String) = {
    classes.filter {
      clazz => clazz.implements(classType) && !clazz.annotations.exists(_.descriptor.endsWith(ignoreModuleName + ";"))
    }.map(clazz => classLoader.loadClass(clazz.name)).toList
  }
}