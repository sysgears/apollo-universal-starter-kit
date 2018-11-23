package common.classes

import java.io.File

import com.typesafe.config.{Config, ConfigFactory}
import org.clapper.classutil.{ClassFinder, ClassInfo}

import collection.JavaConversions._

trait ClassFinder {
  val config: Config = ConfigFactory.load()
  def findClasses: List[ClassInfo] = {
    val modulesPaths = config.getStringList("loadPaths").toList
    findClasses(List(".", "../../modules/core/server-scala") ++ modulesPaths)
  }

  def findClasses(path: List[String]): List[ClassInfo] = {
    ClassFinder(path.map(new File(_))).getClasses().toList
  }
}