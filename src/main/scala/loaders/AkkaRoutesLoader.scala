package loaders

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.typesafe.config.ConfigFactory
import controllers.AkkaRoute
import injection.Injecting

import scala.collection.JavaConverters._

object AkkaRoutesLoader extends Injecting {

  val routes: Route = {
    val classLoader = getClass.getClassLoader
    ConfigFactory.load.getList("routes").asScala.map(_.render.drop(1).dropRight(1)).toList.map {
      className =>
        val clazz = classLoader.loadClass(className)
        injector.getInstance(clazz).asInstanceOf[AkkaRoute]
    }.map(_.routes).reduce(_ ~ _)
  }
}