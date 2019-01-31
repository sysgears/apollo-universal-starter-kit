/**
 * @fileoverview No exteral imports outside specific module.
 * @author SysGears INC
 */

'use strict';

var path = require('path');
var fs = require('fs');

const DEPENDENCIES_VARIANTS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

function getDependencies(providedPath, moduleDependencies, nodeModuleDependencies) {
  const subModuleDependencies = {};
  const dirPath = path.resolve(path.dirname(providedPath));
  const packageJsonPath = findFilesystemEntity(dirPath, 'package.json');
  if (typeof packageJsonPath !== 'undefined') {
    getDependenciesFromPackageJson(packageJsonPath, moduleDependencies, subModuleDependencies);
  }
  checkDependenciesInNodeModules(dirPath, nodeModuleDependencies, subModuleDependencies, moduleDependencies);
}

function checkDependenciesInNodeModules(
  currentFolderPath,
  nodeModuleDependencies,
  subModuleDependencies,
  packageJsonDependencies
) {
  const nodeModulesPath = findFilesystemEntity(currentFolderPath, 'test_node_modules');
  if (typeof nodeModulesPath !== 'undefined') {
    collectNodeModulesDependencies(
      nodeModulesPath,
      nodeModuleDependencies,
      subModuleDependencies,
      packageJsonDependencies
    );
  }
}

function findFilesystemEntity(current, name) {
  let prev;
  do {
    // ddddd/package.json
    const fileName = path.join(current, name);
    if (fs.existsSync(fileName)) {
      return fileName;
    }
    prev = current;
    current = path.dirname(current);
  } while (prev !== current);
  return undefined;
}

function addDependencies(moduleDependencies, dependencies, moduleSubDependencies) {
  for (const name in dependencies) {
    if (dependencies.hasOwnProperty(name)) {
      if (moduleSubDependencies && name.indexOf('@') === 0) {
        const moduleParts = name.split('/');
        moduleSubDependencies[moduleParts[0]] = moduleParts[1];
      }
      moduleDependencies.add(name);
    }
  }
}

function getDependenciesFromPackageJson(packageJsonPath, moduleDependencies, subModuleDependencies) {
  // don't use require here to avoid caching
  // remove BOM from file content before parsing
  const content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8').replace(/^\uFEFF/, ''));
  DEPENDENCIES_VARIANTS.forEach(dependencyVariant => {
    if (typeof content[dependencyVariant] !== 'undefined') {
      addDependencies(moduleDependencies, content[dependencyVariant], subModuleDependencies);
    }
  });
}

function collectNodeModulesDependencies(
  currentPath,
  nodeModuleDependencies,
  subModuleDependencies,
  packageJsonDependencies
  // nested = false
) {
  const nodeModulesFolders = fs.readdirSync(currentPath);
  for (const moduleFolder of nodeModulesFolders) {
    const stat = fs.lstatSync(path.join(currentPath, moduleFolder));
    let inSubModuleDirectory = false,
      computedNodeModulesName;
    for (let item of packageJsonDependencies) {
      if (moduleFolder === item.split('/')[1]) {
        inSubModuleDirectory = true;
        computedNodeModulesName = item;
      }
    }
    if (packageJsonDependencies.has(moduleFolder) || inSubModuleDirectory) {
      if (stat.isDirectory() && !inSubModuleDirectory) {
        nodeModuleDependencies.add(moduleFolder);
        continue;
      }
      if (inSubModuleDirectory) {
        nodeModuleDependencies.add(computedNodeModulesName);
        continue;
      }
      if (stat.isSymbolicLink()) {
        getDependenciesFromPackageJson(path.join(currentPath, moduleFolder, 'package.json'), nodeModuleDependencies);
        continue;
      }
    }
    if (subModuleDependencies[moduleFolder]) {
      if (stat.isDirectory()) {
        collectNodeModulesDependencies(
          path.join(currentPath, moduleFolder),
          nodeModuleDependencies,
          subModuleDependencies,
          packageJsonDependencies
        );
        continue;
      }
    }
    // for(const item of nodeModuleDependencies) {
    //   console.log(item)
    // }
  }
}

function missingErrorMessage(packageName) {
  return `Can't find '${packageName}' in the packages.json or in related module's package.json.`;
}

function reportIfMissing(context, node) {
  const moduleDependencies = new Set();
  const nodeModuleDependencies = new Set();
  // const nodeModuleDependenciesSymbolicLink = new Set();
  getDependencies(context.getFilename(), moduleDependencies, nodeModuleDependencies);
  if (!nodeModuleDependencies.has(node.source.value)) {
    // console.log('nodeModuleDependencies12312321', node.source.value, nodeModuleDependencies)
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

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ImportDeclaration: function(node) {
        reportIfMissing(context, node);
      }
    };
  }
};
