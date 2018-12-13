package guice

import com.google.inject.Provides
import common.shapes.ServerModule
import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import core.guice.injection.Injecting.{injector, modulesPaths}
import net.codingwell.scalaguice.ScalaModule
import org.clapper.classutil.ClassInfo

class GlobalBindings extends ScalaModule {

  @Provides
  def modules: Seq[ServerModule] = {
    InitializedClasses[ServerModule](
      FilteredClasses(
        FoundClasses(modulesPaths.toList),
        serverModuleFilter
      ),
      initializer = Some(injector.getInstance(_).asInstanceOf[ServerModule])
    ).retrieve
  }

  def serverModuleFilter(classInfo: ClassInfo): Boolean = classInfo.superClassName == "common.shapes.ServerModule"
}