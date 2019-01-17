/* tslint:disable */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from "fs";
import * as path from "path";

import { findImports, ImportKind } from "tsutils";


export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = `Can't find this dependency in the tree of dependencies.`;
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'recursive-dependencies',
    description: `Dependency should be listed in module packages.json or it should be inside one of the used @modules.`,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: true
  };
  public static MODULE_STRUCTURE = [
    'client-react',
    'client-angular',
    'server-ts',
    'common'
  ];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new RecursiveDependenciesWalker(sourceFile, this.getOptions())
    );
  }
}
interface PackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
}

interface Dependencies extends Object {
  [name: string]: any;
}

// The walker takes care of all the work.
class RecursiveDependenciesWalker extends Lint.RuleWalker {

  public walk(sourceFile: ts.SourceFile) {
    let dependencies: Set<string> | undefined;
    for (const name of findImports(sourceFile, ImportKind.All)) {
      if (!ts.isExternalModuleNameRelative(name.text)) {
        console.log('moduleName', name.text);
        if (dependencies === undefined) {
          dependencies = this.getDependencies(sourceFile.fileName);
        }
        if (!dependencies.has(name.text)){
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
        console.log('content', content);
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
          console.log('dependency', dependency);
          if (dependency.includes('@module')) {
            const [, moduleName] = dependency.split('/');
            const moduleFolders = Rule.MODULE_STRUCTURE
            .filter((moduleFolder) => {
              console.log('moduleName', moduleName);
              console.log('moduleFolder', moduleName.includes(moduleFolder));
              return moduleName.includes(moduleFolder);
            })
            .map((moduleFolder) => moduleName.replace(`-${moduleFolder}`, ''))
            console.log('res', moduleFolders);
            const relatedModulePath: string = moduleFolders.length === 1 ? 
            this.getRelatedModulePath(packageJsonPath, moduleName, moduleFolders[0]) : '';
            if (relatedModulePath) {
              nestedResult = this.getDependencies(relatedModulePath, true);
            }
          }
        });
      }

    }

    return new Set([...Array.from(result), ...Array.from(nestedResult)]);
  }

  private getRelatedModulePath(current: string, moduleName: string, moduleFolder: string): string {
    const rootModulesDirPath: string = path.join(current, moduleFolder, '..', '..', '..', '..');
    console.log('rootModulesDirPath', rootModulesDirPath);

    const rootModulesDir: string[] = fs.readdirSync(rootModulesDirPath);
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
      console.log('1111111111fileName',fileName )
      if (fs.existsSync(fileName)) {
        return fileName;
      }

      prev = current;
      current = path.dirname(current);
      console.log('prev', prev);
      console.log('current', current);
    } while (prev !== current);
    return undefined;
  }

}
