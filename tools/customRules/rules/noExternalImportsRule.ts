import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from "fs";
import * as path from "path";

import { findImports, ImportKind } from "tsutils";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = `Can't find this dependency in the packages.json or in ` +
    `related module's package.json.`;
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-external-imports',
    description: `No exteral imports outside specific module.`,
    descriptionDetails: `No external imports outside specific module. All module dependencies should be listed in module packages.json 
    or it should be inside one of the used @modules.`,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: false
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoExternalImportsWalker(sourceFile, Rule.metadata.ruleName, null)
    );
  }
}
interface PackageJson {
  name: string;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
  [key: string]: any
}

interface Dependencies extends Object {
  [name: string]: any;
}

type FindFilesystemEntity = (current: string) => string | undefined;

const MODULE_IMPLIMENTATION = [
  'client-react',
  'client-angular',
  'server-ts',
  'common'
];
const DEPENDENCIES_VARIANTS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

type SubModuleDependencies = { [key: string]: string };

const MODULE_TAG = '@module';

class NoExternalImportsWalker extends Lint.AbstractWalker<null> {
  public walk(sourceFile: ts.SourceFile) {
    let dependencies: Set<string> | undefined;
    for (const name of findImports(sourceFile, ImportKind.ImportDeclaration)) {
      if (!ts.isExternalModuleNameRelative(name.text)) {
        if (dependencies === undefined) {
          dependencies = this.getDependencies(sourceFile.fileName);
        }
        if (!dependencies.has(name.text)) {
          this.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
      }
    }
  }


  /**
   * Get dependencies of the module and related module
   * @param providedPath 
   * @param relatedModule 
   */
  private getDependencies(providedPath: string, relatedModule: boolean = false): Set<string> {
    const moduleDependencies = new Set<string>();
    const nodeModuleDependencies = new Set<string>();
    const subModuleDependencies: SubModuleDependencies = {};
    const dirPath: string = relatedModule ? providedPath : path.resolve(path.dirname(providedPath));
    const packageJsonPath = this.findFilesystemEntity(dirPath, 'package.json');
    if (typeof packageJsonPath !== 'undefined') {
      this.getDependenciesFromPackageJson(packageJsonPath, moduleDependencies, subModuleDependencies)
    }
    this.checkDependenciesInNodeModules(dirPath, nodeModuleDependencies, subModuleDependencies, moduleDependencies);


    return moduleDependencies;
  }

  checkDependenciesInNodeModules(currentFolderPath: string,
    nodeModuleDependencies: Set<string>,
    subModuleDependencies: SubModuleDependencies,
    packageJsonDependencies: Set<string>) {
    const nodeModulesPath = this.findFilesystemEntity(currentFolderPath, 'test_node_modules');
    if (typeof nodeModulesPath !== 'undefined') {

      this.collectNodeModulesDependencies(nodeModulesPath, nodeModuleDependencies, subModuleDependencies, packageJsonDependencies);

    }
  }

  private collectNodeModulesDependencies(currentPath: string, nodeModuleDependencies: Set<string>,
    subModuleDependencies: SubModuleDependencies,
    packageJsonDependencies: Set<string>, nested: boolean = false) {
    const localPackageJsonDependencies = new Set<string>();
    const localSubModuleDependencies: SubModuleDependencies = {};
    const nodeModulesFolders = fs.readdirSync(currentPath)
    for (const moduleFolder of nodeModulesFolders) {
      const stat = fs.lstatSync(path.join(currentPath, moduleFolder))
      if (packageJsonDependencies.has(moduleFolder)) {
        if (stat.isDirectory()) {
          nodeModuleDependencies.add(moduleFolder)
          continue;
        }
        if (stat.isSymbolicLink()) {
          this.getDependenciesFromPackageJson(
            path.join(currentPath, moduleFolder, 'package.json'),
            nodeModuleDependencies,
            localSubModuleDependencies)
          continue;
        }
      }
      if (subModuleDependencies[moduleFolder]) {
        if (stat.isDirectory()) {
          this.collectNodeModulesDependencies(path.join(currentPath, moduleFolder),
            nodeModuleDependencies, subModuleDependencies, packageJsonDependencies)
        }
      }
      console.log('Name', moduleFolder);
      console.log('isFolder', stat.isDirectory());
      console.log('Link', stat.isSymbolicLink());
    }
  }

  /**
   *  Parse package.json and get all needed dependencies
   * @param packageJsonPath 
   * @param moduleDependencies 
   */
  private getDependenciesFromPackageJson(packageJsonPath: string, moduleDependencies: Set<string>, subModuleDependencies: SubModuleDependencies) {
    // don't use require here to avoid caching
    // remove BOM from file content before parsing
    try {
      const content = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, ""),
      ) as PackageJson;
      DEPENDENCIES_VARIANTS.forEach((dependencyVariant: string) => {
        if (typeof content[dependencyVariant] !== 'undefined') {
          this.addDependencies(moduleDependencies, subModuleDependencies, content[dependencyVariant]);
        }
      });
    } catch (e) { }

  }

  /**
   * Add dependency name from package.json to the set and object
   */
  private addDependencies(moduleDependencies: Set<string>,
    moduleSubDependencies: SubModuleDependencies,
    dependencies: Dependencies) {
    for (const name in dependencies) {
      if (dependencies.hasOwnProperty(name)) {
        if (name.indexOf('@') === 0) {
          const moduleParts = name.split('/')
          moduleSubDependencies[moduleParts[0]] = moduleParts[1];
        }
        moduleDependencies.add(name);
      }
    }
  }

  /**
   * Look for findFilesystemEntity
   * @param current 
   */
  private findFilesystemEntity(current: string, name: string): string | undefined {
    let prev: string;
    do {
      const fileName = path.join(current, name);
      if (fs.existsSync(fileName)) {
        return fileName;
      }
      prev = current;
      current = path.dirname(current);
    } while (prev !== current);
    return undefined;
  }

}
