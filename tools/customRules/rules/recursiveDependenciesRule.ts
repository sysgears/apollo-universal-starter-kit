/* tslint:disable */
import * as ts from 'typescript';
import * as Lint from 'tslint';

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

// The walker takes care of all the work.
class RecursiveDependenciesWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
      //let dependencies: Set<string> | undefined;
      if (ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text && !ts.isExternalModuleNameRelative(node.moduleSpecifier.text)) {
          const packageNameParts = node.moduleSpecifier.text.split(/\//g);
          if (node.moduleSpecifier.text[0] === '@'){
              //packageNameParts[0]
          }
      }

      // const {parent, ...rest} = node;
      //console.log('import11', rest,  );

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }


}
