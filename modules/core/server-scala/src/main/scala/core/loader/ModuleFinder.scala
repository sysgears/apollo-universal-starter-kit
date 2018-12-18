package core.loader

import core.loader.entities.{FilteredClasses, FoundClasses, InitializedClasses}

case class ModuleFinder(paths: List[String] = List(".")) {

  val modulesPaths: Set[String] = {

    /**
      * Recursively finds paths to connected modules and their submodules.
      *
      * @param paths the 'start points' from which to find the paths to connected modules
      * @return set of paths to all connected modules within the application
      */
    def findModulesPaths(paths: List[String]): Set[String] = {
      if (paths.nonEmpty) {
        val foundPaths =
          InitializedClasses[Any](
            FilteredClasses(
              FoundClasses(paths),
              filter = classInfo => classInfo.name.contains("ModulesInfo") && !classInfo.name.contains("$")
            ),
            initializer = Some(clazz => clazz.getMethod("modules").invoke(this))
          ).retrieve
            .asInstanceOf[List[List[String]]]
            .flatten.map {
            path => if (!path.startsWith("../../modules")) path.replace("../../", "../../modules/") else path
          }
        foundPaths ++ findModulesPaths(foundPaths)
      } else paths
    }.toSet

    findModulesPaths(paths: List[String])
  }
}