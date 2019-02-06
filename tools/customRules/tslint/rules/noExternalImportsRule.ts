import * as ts from 'typescript';
import * as Lint from 'tslint';

import { findImports, ImportKind } from "tsutils";
import getDependencies from '../../eslint/common/no-external-imports'

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


class NoExternalImportsWalker extends Lint.AbstractWalker<null> {
  public walk(sourceFile: ts.SourceFile) {
    const moduleDependencies = new Set<string>();
    for (const name of findImports(sourceFile, ImportKind.ImportDeclaration)) {
      if (!ts.isExternalModuleNameRelative(name.text)) {
        getDependencies(sourceFile.fileName, moduleDependencies);
        console.log('des', moduleDependencies)
        if (!moduleDependencies.has(name.text)) {
          this.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
      }
    }
  }
}
