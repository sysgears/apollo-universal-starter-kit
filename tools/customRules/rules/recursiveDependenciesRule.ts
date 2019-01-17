/* tslint:disable */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from "fs";
import * as path from "path";

import { findImports, ImportKind } from "tsutils";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = `Can't find this dependency in the packages.json or in ` +
  `related module's package.json.`;
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'recursive-dependencies',
    description: `Dependency should be listed in module packages.json or it should be inside one of the used @modules.`,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: false
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new RecursiveDependenciesWalker(sourceFile, Rule.metadata.ruleName, null)
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

// The walker takes care of all the work.
class RecursiveDependenciesWalker extends Lint.AbstractWalker<null> {

  public walk(sourceFile: ts.SourceFile) {
    let dependencies: Set<string> | undefined;
    for (const name of findImports(sourceFile, ImportKind.All)) {
      if (!ts.isExternalModuleNameRelative(name.text)) {
        if (dependencies === undefined) {
          dependencies = this.getDependencies(sourceFile.fileName);
        }
        if (dependencies.has('module') && !dependencies.has(name.text)){
          this.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
      }
    }
  }


  private getDependencies(providedPath: string, nestedModule: boolean = false): Set<string> {
    const result = new Set<string>();
    let nestedResult = new Set<string>();
    const dirPath: string = nestedModule ? providedPath : path.resolve(path.dirname(providedPath));
    const packageJsonPath = this.findPackageJson(dirPath);
    if (packageJsonPath !== undefined) {
      try {
        // don't use require here to avoid caching
        // remove BOM from file content before parsing
        const content = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, ""),
        ) as PackageJson;
        console.log('content',content );
        if (content.name !== undefined && content.name.includes('@module')) {
          result.add('module');
        }
        if (content.dependencies !== undefined) {
          this.addDependencies(result, content.dependencies);
        }
        if (content.peerDependencies !== undefined) {
          this.addDependencies(result, content.peerDependencies);
        }
        if (content.devDependencies !== undefined) {
          this.addDependencies(result, content.devDependencies);
        }
        if (content.optionalDependencies !== undefined) {
          this.addDependencies(result, content.optionalDependencies);
        }
      } catch {
        // treat malformed package.json files as empty
      }

      if (!nestedModule) {
        result.forEach((dependency) => {
          if (dependency.includes('@module')) {
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
              nestedResult = this.getDependencies(relatedModulePath, true);
            }
          }
        });
      }
    }

    nestedResult.forEach(result.add, result);

    return result;
  }

  private getRelatedModulePath(current: string, moduleName: string, moduleFolder: string): string {
    const rootModulesDirPath: string = path.join(current, moduleFolder, '..', '..', '..', '..');
    console.log('rootModulesDirPath', rootModulesDirPath);
    return fs.existsSync(rootModulesDirPath) ? `${rootModulesDirPath}/${moduleName}/${moduleFolder}` : '';
  }

  private addDependencies(result: Set<string>, dependencies: Dependencies) {
    for (const name in dependencies) {
      if (dependencies.hasOwnProperty(name)) {
        result.add(name);
      }
    }
  }

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
