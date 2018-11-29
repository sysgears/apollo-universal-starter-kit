import classes.{ClassInstances, ClassesMetaInfo}

case class InitializedClasses[T](classMetaInfo: ClassesMetaInfo, initializer: Option[Class[_] => T] = None) extends ClassInstances[T] {
  override def retrieve: List[T] = {
    classMetaInfo.retrieve.map(classInfo => getClass.getClassLoader.loadClass(classInfo.name)).map {
      initializer match {
        case Some(func) => func
        case _ => clazz: Class[_] => clazz.newInstance.asInstanceOf[T]
      }
    }
  }
}