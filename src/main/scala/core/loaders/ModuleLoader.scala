package core.loaders

import java.io.File

import core.controllers.AkkaRoute
import core.graphql.GraphQLSchema
import core.guice.injection.Injecting.injector
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassFinder

object ModuleLoader {

  private val classLoader = getClass.getClassLoader
  private val classes = ClassFinder(List(".").map(new File(_))).getClasses()

  val guiceModules: List[ScalaModule] = instantiateClasses[ScalaModule](classOf[ScalaModule].getName)

  lazy val akkaRouteModules: List[AkkaRoute] = instantiateClassesWithInject[AkkaRoute](classOf[AkkaRoute].getName)
  lazy val graphQLSchemaModules: List[GraphQLSchema] = instantiateClassesWithInject[GraphQLSchema](classOf[GraphQLSchema].getName)

  private def instantiateClasses[T](classType: String) = {
    loadClasses(classType).map(_.newInstance.asInstanceOf[T])
  }

  private def instantiateClassesWithInject[T](classType: String) = {
    loadClasses(classType).map(injector.getInstance(_).asInstanceOf[T])
  }

  private def loadClasses(classType: String) = {
    classes.filter(_.implements(classType)).map(clazz => classLoader.loadClass(clazz.name)).toList
  }
}