import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'import statement forbidden';
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-imports',
    description:
      'Disallows importing from react-emotion and encourage import from emotion.',
    descriptionDetails: Lint.Utils.dedent`
             Disallows if anything other than styled is imported from react-emotion, because
             emotion's exports are not re-exported from react-emotion in emotion 10 and above.
        `,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: true
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoImportsWalker(sourceFile, this.getOptions())
    );
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // create a failure at the current position
    this.addFailureAtNode(node, Rule.FAILURE_STRING);

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}
