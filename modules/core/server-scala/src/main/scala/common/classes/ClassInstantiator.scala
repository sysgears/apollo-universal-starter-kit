package common.classes

import org.clapper.classutil.ClassInfo

trait ClassInstantiator {

  def instatiateClasses[T](classes: List[ClassInfo], init: Class[_] => T): List[T] = {
    classes.map(classInfo => getClass.getClassLoader.loadClass(classInfo.name)).map(init)
  }
}