package guice

import com.google.inject._
import common.graphql.schema.GraphQL
import common.shapes.ServerModule
import core.loader.ModuleFinder
import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}
import graphql.GraphQLSchema
import org.clapper.classutil.ClassInfo

class GlobalBinding(moduleFinder: ModuleFinder) extends AbstractModule {

  override def configure(): Unit = {
    bind(classOf[GraphQL]).to(classOf[GraphQLSchema])
  }

  @Provides
  @Singleton
  def modules(injector: Injector): Seq[ServerModule] = {
    InitializedClasses[ServerModule](
      FilteredClasses(
        FoundClasses(moduleFinder.modulesPaths.toList),
        serverModuleFilter
      ),
      initializer = Some(injector.getInstance(_).asInstanceOf[ServerModule])
    ).retrieve
  }

  def serverModuleFilter(classInfo: ClassInfo): Boolean = classInfo.superClassName == "common.shapes.ServerModule"
}