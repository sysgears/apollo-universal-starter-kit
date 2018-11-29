import java.io.File

import classes.ClassesMetaInfo
import org.clapper.classutil.{ClassFinder, ClassInfo}

case class FoundClasses(paths: List[String]) extends ClassesMetaInfo {
  override def retrieve: List[ClassInfo] = {
    ClassFinder(paths.map(new File(_))).getClasses().toList
  }
}