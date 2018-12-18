package core.loader.classes

trait ClassInstances[T] {
  def retrieve: List[T]
}