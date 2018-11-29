import classes.ClassesMetaInfo
import org.clapper.classutil.ClassInfo

case class FilteredClasses(classesMetaInfo: ClassesMetaInfo, filter: ClassInfo => Boolean) extends ClassesMetaInfo {
  override def retrieve: List[ClassInfo] = {
    classesMetaInfo.retrieve.filter(filter)
  }
}