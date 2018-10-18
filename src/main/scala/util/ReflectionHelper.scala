package util

object ReflectionHelper {

  def getInstances[T](classesNames: List[String]): List[T] = {
    classesNames.map(getInstance[T])
  }

  def getInstance[T](name: String): T = {
    getClass.getClassLoader.loadClass(name).newInstance.asInstanceOf[T]
  }
}