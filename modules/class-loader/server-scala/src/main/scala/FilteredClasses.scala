import classes.ClassesMetaInfo
import org.clapper.classutil.ClassInfo

case class FilteredClasses(classMetaInfo: ClassesMetaInfo, filter: ClassInfo => Boolean) extends ClassesMetaInfo {
  override def retrieve: List[ClassInfo] = {
    classMetaInfo.retrieve.filter(filter)
  }
}