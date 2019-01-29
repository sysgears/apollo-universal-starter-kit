/**
 * @fileoverview No exteral imports outside specific module.
 * @author SysGears INC
 */

'use strict';
var path = require('path');
var fs = require('fs');
var minimatch = require('minimatch');
var { isArray, isEmpty } = require('lodash');
var readPkgUp = require('read-pkg-up');

function hasKeys(obj = {}) {
  return Object.keys(obj).length > 0;
}

function extractDepFields(pkg) {
  return {
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {},
    optionalDependencies: pkg.optionalDependencies || {},
    peerDependencies: pkg.peerDependencies || {}
  };
}

function getDependencies(context, packageDir) {
  let paths = [];
  try {
    const packageContent = {
      dependencies: {},
      devDependencies: {},
      optionalDependencies: {},
      peerDependencies: {}
    };

    if (!isEmpty(packageDir)) {
      if (!isArray(packageDir)) {
        paths = [path.resolve(packageDir)];
      } else {
        paths = packageDir.map(dir => path.resolve(dir));
      }
    }

    if (!isEmpty(paths)) {
      // use rule config to find package.json
      paths.forEach(dir => {
        const _packageContent = extractDepFields(JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')));
        Object.keys(packageContent).forEach(depsKey =>
          Object.assign(packageContent[depsKey], _packageContent[depsKey])
        );
      });
    } else {
      // use closest package.json
      Object.assign(
        packageContent,
        extractDepFields(readPkgUp.sync({ cwd: context.getFilename(), normalize: false }).pkg)
      );
    }

    if (
      ![
        packageContent.dependencies,
        packageContent.devDependencies,
        packageContent.optionalDependencies,
        packageContent.peerDependencies
      ].some(hasKeys)
    ) {
      return null;
    }

    return packageContent;
  } catch (e) {
    if (!isEmpty(paths) && e.code === 'ENOENT') {
      context.report({
        message: 'The package.json file could not be found.',
        loc: { line: 0, column: 0 }
      });
    }
    if (e.name === 'JSONError' || e instanceof SyntaxError) {
      context.report({
        message: 'The package.json file could not be parsed: ' + e.message,
        loc: { line: 0, column: 0 }
      });
    }

    return null;
  }
}

function reportIfMissing(context, deps, depsOptions, node, name) {
  if (node.importKind === 'type') {
    return;
  }

  // if (importType(name, context) !== 'external') {
  //   return;
  // }
  //
  // const resolved = resolve(name, context);
  // if (!resolved) {
  //   return;
  // }

  const splitName = name.split('/');
  const packageName = splitName[0][0] === '@' ? splitName.slice(0, 2).join('/') : splitName[0];
  const isInDeps = deps.dependencies[packageName] !== undefined;
  const isInDevDeps = deps.devDependencies[packageName] !== undefined;
  const isInOptDeps = deps.optionalDependencies[packageName] !== undefined;
  const isInPeerDeps = deps.peerDependencies[packageName] !== undefined;

  if (
    isInDeps ||
    (depsOptions.allowDevDeps && isInDevDeps) ||
    (depsOptions.allowPeerDeps && isInPeerDeps) ||
    (depsOptions.allowOptDeps && isInOptDeps)
  ) {
    return;
  }

  if (isInDevDeps && !depsOptions.allowDevDeps) {
    context.report(node, devDepErrorMessage(packageName));
    return;
  }

  if (isInOptDeps && !depsOptions.allowOptDeps) {
    context.report(node, optDepErrorMessage(packageName));
    return;
  }

  context.report(node, missingErrorMessage(packageName));
}

function devDepErrorMessage(packageName) {
  return `'${packageName}' should be listed in the project's dependencies, not devDependencies.`;
}

function optDepErrorMessage(packageName) {
  return `'${packageName}' should be listed in the project's dependencies, ` + `not optionalDependencies.`;
}
function missingErrorMessage(packageName) {
  return (
    `'${packageName}' should be listed in the project's dependencies. ` + `Run 'npm i -S ${packageName}' to add it`
  );
}

function testConfig(config, filename) {
  // Simplest configuration first, either a boolean or nothing.
  if (typeof config === 'boolean' || typeof config === 'undefined') {
    return config;
  }
  // Array of globs.
  return config.some(c => minimatch(filename, c) || minimatch(filename, path.join(process.cwd(), c)));
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
    // variables should be defined here
    const options = context.options[0] || {};
    const filename = context.getFilename();
    const deps = getDependencies(context, options.packageDir) || extractDepFields({});
    const depsOptions = {
      allowDevDeps: testConfig(options.devDependencies, filename) !== false,
      allowOptDeps: testConfig(options.optionalDependencies, filename) !== false,
      allowPeerDeps: testConfig(options.peerDependencies, filename) !== false
    };
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration: function(node) {
        reportIfMissing(context, deps, depsOptions, node, node.source.value);
      }
      // ImportDeclaration: function(node) {
      //   node.specifiers.forEach(function(specifier) {
      //     if (
      //       specifier.type === 'ImportDefaultSpecifier' &&
      //       specifier.local.type === 'Identifier' &&
      //       specifier.local.name === '_'
      //     ) {
      //       context.report(node, 'Prefer importing single functions over a full FP library');
      //     }
      //   });
      // }
    };
  }
};
