package classes

import java.io.File

import org.clapper.classutil.{ClassFinder, ClassInfo}

trait ClassFinder {
  def findClasses(path: String): List[ClassInfo] = {
    findClasses(List(path))
  }

  def findClasses(path: List[String]): List[ClassInfo] = {
    ClassFinder(path.map(new File(_))).getClasses().toList
  }
}