/**
 * @fileoverview No exteral imports outside specific module.
 * @author SysGears INC
 */

'use strict';

const getDependencies = require('../../common/no-external-imports');

function missingErrorMessage(packageName) {
  return `Can't find '${packageName}' in the packages.json or in related module's package.json.`;
}

function reportIfMissing(context, node, moduleDependencies) {
  if (!moduleDependencies.has(node.source.value)) {
    context.report(node, missingErrorMessage(node.source.value));
  }
}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'No exteral imports outside specific module.',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const moduleDependencies = new Set();
    getDependencies(context.getFilename(), moduleDependencies);
    // any helper functions should go here or else delete this section
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ImportDeclaration: function(node) {
        reportIfMissing(context, node, moduleDependencies);
      }
    };
  }
};
