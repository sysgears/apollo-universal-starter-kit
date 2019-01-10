package core.services.conf.dotenv

import java.util.Collections

import scala.util.{Failure, Success, Try}
import scala.util.control.NonFatal
import scala.collection.JavaConverters._

/**
  * Extends internal Map with custom environment variable values, so that they could be accessed via the "sys.env". <br/>
  * <br/>
  * <b>NOTE:</b> <i>Heavily uses reflection, since JVM does not allow to mutate process environment. <b>Should not be used</b>
  * after any other service, that depends on ENV variables.</i>
  */
object SysEnvExtender {

  /**
    * Appends the environment variables from the given Map to a "sys.env".
    *
    * @param newEnv a map of new env variables, that should be added to the "sys.env"
    */
  def extend(newEnv: `.env`): Unit = {
    val newEnvAsJavaMap: java.util.Map[String, String] = {
      //This method may **completely rewrite** the copy of process environment so it should be ensured that all initial
      // machine env values will stay there and have a higher priority that those from the '.env' files if any clashes
      // occur.
      (newEnv ++ sys.env).asJava
    }
    Try {
      val processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment")

      val theEnvironmentField = processEnvironmentClass.getDeclaredField("theEnvironment")
      theEnvironmentField.setAccessible(true)
      val env = theEnvironmentField.get(null).asInstanceOf[java.util.Map[String, String]]
      env.putAll(newEnvAsJavaMap)

      val theCaseInsensitiveEnvironmentField = processEnvironmentClass.getDeclaredField("theCaseInsensitiveEnvironment")
      theCaseInsensitiveEnvironmentField.setAccessible(true)
      val ciEnv = theCaseInsensitiveEnvironmentField.get(null).asInstanceOf[java.util.Map[String, String]]
      ciEnv.putAll(newEnvAsJavaMap)
    } match {
      case Failure(_: NoSuchFieldException) =>
        Try {
          val classes = classOf[Collections].getDeclaredClasses
          val env = System.getenv
          classes.filter(_.getName == "java.util.Collections$UnmodifiableMap").foreach {
            cl =>
              val field = cl.getDeclaredField("m")
              field.setAccessible(true)
              val map = field.get(env).asInstanceOf[java.util.Map[String, String]]
              map.clear()
              map.putAll(newEnvAsJavaMap)
          }
        } match {
          case Failure(NonFatal(e2)) => e2.printStackTrace()
          case Success(_) =>
        }
      case Failure(NonFatal(e1)) => e1.printStackTrace()
      case Success(_) =>
    }
  }
}

/**
  * Contains syntactic sugar for extending the `sys.env`
  */
trait SysEnvExtenderImplicits {
  implicit class SysEnvExtendable(`sys.env`: `.env`) {
    def extend(newEnv: `.env`): Unit = SysEnvExtender extend newEnv
  }
}
