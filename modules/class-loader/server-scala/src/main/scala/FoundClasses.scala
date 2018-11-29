import java.io.File

import classes.ClassesMetaInfo
import org.clapper.classutil.{ClassFinder, ClassInfo}

case class FoundClasses(path: List[String]) extends ClassesMetaInfo {
  override def retrieve: List[ClassInfo] = {
    ClassFinder(path.map(new File(_))).getClasses().toList
  }
}