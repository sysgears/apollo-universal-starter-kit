package common.classes

import org.clapper.classutil.ClassInfo

trait ClassFilter {

  def filterClasses(classes: List[ClassInfo], filter: ClassInfo => Boolean): List[ClassInfo] = {
    classes.filter(filter)
  }
}