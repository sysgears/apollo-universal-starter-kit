/* tslint:disable */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from "fs";
import * as path from "path";

import { findImports, ImportKind } from "tsutils";


export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Cant find this dependency in the tree of dependencies';
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'recursive-dependencies',
    description: `Dependency should be listed in module packages.json or it should be inside one of the
    imported modules`,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: true
  };

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
        const packageNameParts = name.text.split(/\//g);
        const moduleName = name.text[0] === '@' ? packageNameParts[0] : `${packageNameParts[0]}/${packageNameParts[1]}`;
        if (dependencies === undefined) {
          dependencies = this.getDependencies(sourceFile.fileName);
        }
        return dependencies.has(moduleName);
      }
    }
  }


  private getDependencies(fileName: string): Set<string> {
    const result = new Set<string>();
    const packageJsonPath = this.findPackageJson(path.resolve(path.dirname(fileName)));
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

      result.forEach((dependency) => {
        console.log('dependency', dependency);
        if (dependency.includes('@module')){
            this.findRelatedModulePackageJson(packageJsonPath);
        }
      });

    }

    return result;
  }

  private findRelatedModulePackageJson(current: string): void {
    const rootDir = path.dirname(path.dirname(current));
    const dir = fs.readdirSync(rootDir)
    console.log('dir', dir);
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
      console.log('prev', prev);
      console.log('current', current);
    } while (prev !== current);
    return undefined;
  }

}
