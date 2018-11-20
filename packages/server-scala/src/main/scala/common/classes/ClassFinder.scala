package common.classes

import java.io.File

import org.clapper.classutil.{ClassFinder, ClassInfo}

trait ClassFinder {

  def findClasses: List[ClassInfo] = {
    findClasses(List("."))
  }

  def findClasses(path: List[String]): List[ClassInfo] = {
    ClassFinder(path.map(new File(_))).getClasses().toList
  }
}