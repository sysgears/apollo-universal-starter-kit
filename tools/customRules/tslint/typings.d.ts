interface Dependencies extends Object {
  [name: string]: any;
}

declare module "noExternalImportsRule" {
  function checkDependenciesInNodeModules(currentFolderPath: string, packageJsonDependencies: Set<string>): void;
  function findFilesystemEntity(current: string, name: string): string | undefined;
  function collectNodeModulesDependencies(currentPath: string,  packageJsonDependencies: Set<string>): void;
  function getDependenciesFromPackageJson(packageJsonPath: string, moduleDependencies: Set<string>): void;
  function addDependencies(moduleDependencies: Set<string>, dependencies: Dependencies): void;
  export function getDependencies(providedPath: string, moduleDependencies: Set<string>): void;
}