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
    descriptionDetails:`No external imports outside specific module. All module dependencies should be listed in module packages.json 
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
}

interface Dependencies extends Object {
  [name: string]: any;
}

const MODULE_IMPLIMENTATION = [
  'client-react',
  'client-angular',
  'server-ts',
  'common'
];
const MODULE_TAG = '@module';

class NoExternalImportsWalker extends Lint.AbstractWalker<null> {
  public walk(sourceFile: ts.SourceFile) {
    let dependencies: Set<string> | undefined;
    for (const name of findImports(sourceFile, ImportKind.ImportDeclaration)) {
      if (!ts.isExternalModuleNameRelative(name.text)) {
        if (dependencies === undefined) {
          dependencies = this.getDependencies(sourceFile.fileName);
        }
        if (dependencies.has('is_module') && !dependencies.has(name.text)){
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
    let relatedModuleDependencies = new Set<string>();
    const dirPath: string = relatedModule ? providedPath : path.resolve(path.dirname(providedPath));
    const packageJsonPath = this.findPackageJson(dirPath);
    if (typeof packageJsonPath !== 'undefined') {
      this.getDependenciesFromPackageJson(packageJsonPath, moduleDependencies)

      if (!relatedModule) {
        moduleDependencies.forEach((dependency) => {
          if (dependency.includes(MODULE_TAG)) {
            const [, moduleName] = dependency.split('/');
            const moduleNames: Array<{[key: string]: string}> = MODULE_IMPLIMENTATION
            .filter((moduleImplimentationName) => moduleName.includes(moduleImplimentationName))
            .map((moduleImplimentationName) => ({
              moduleImplimentationName,
              moduleGroupName: moduleName.replace(`-${moduleImplimentationName}`, '')
            }));
            const relatedModulePath: string = moduleNames.length === 1 ? 
            this.getRelatedModulePath(packageJsonPath, moduleNames[0].moduleGroupName, moduleNames[0].moduleImplimentationName) : '';
            if (relatedModulePath) {
              relatedModuleDependencies = this.getDependencies(relatedModulePath, true);
            }
          }
        });
      }
    }

    relatedModuleDependencies.forEach(moduleDependencies.add, moduleDependencies);

    return moduleDependencies;
  }

  /**
   *  Parse package.json and get all needed dependencies
   * @param packageJsonPath 
   * @param moduleDependencies 
   */
  private getDependenciesFromPackageJson(packageJsonPath: string, moduleDependencies: Set<string>){
        // don't use require here to avoid caching
        // remove BOM from file content before parsing
        const content = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, ""),
        ) as PackageJson;
        if (content.name !== undefined && content.name.includes(MODULE_TAG)) {
          moduleDependencies.add('is_module');
        }
        if (typeof content.dependencies !== 'undefined') {
          this.addDependencies(moduleDependencies, content.dependencies);
        }
        if (typeof content.peerDependencies !== 'undefined') {
          this.addDependencies(moduleDependencies, content.peerDependencies);
        }
        if (content.devDependencies !== undefined) {
          this.addDependencies(moduleDependencies, content.devDependencies);
        }
        if (content.optionalDependencies !== undefined) {
          this.addDependencies(moduleDependencies, content.optionalDependencies);
        }
  }

  /**
   * Get path of the related module, which is specified in module package.json
   * @param packageJsonPath 
   * @param moduleGroupName 
   * @param moduleImplimentationName 
   */
  private getRelatedModulePath(packageJsonPath: string, moduleGroupName: string, moduleImplimentationName: string): string {
    const modulesRootPath: string = this.getModulesRootPath(packageJsonPath);
    return fs.existsSync(modulesRootPath) ? `${modulesRootPath}/${moduleGroupName}/${moduleImplimentationName}` : '';
  }

  /**
   * Get path of the modules folder, from path of where related module package.json situated
   * /modules/modulesGroup/moduleImplimentation/package.json -> /modules
   * @param packageJsonPath 
   */
  private getModulesRootPath(packageJsonPath: string){
    return path.join(path.dirname(packageJsonPath), '..', '..');
  }

  /**
   * Add dependency name from package.json to the set
   * @param moduleDependencies 
   * @param dependencies 
   */
  private addDependencies(moduleDependencies: Set<string>, dependencies: Dependencies) {
    for (const name in dependencies) {
      if (dependencies.hasOwnProperty(name)) {
        moduleDependencies.add(name);
      }
    }
  }

  /**
   * Look for module packages.json path 
   * @param current 
   */
  private findPackageJson(current: string): string | undefined {
    let prev: string;
    do {
      const fileName = path.join(current, "package.json");
      if (fs.existsSync(fileName)) {
        return fileName;
      }
      prev = current;
      current = path.dirname(current);
    } while (prev !== current);
    return undefined;
  }

}
