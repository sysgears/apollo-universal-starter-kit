'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var Lint = require('tslint');
var fs = require('fs');
var path = require('path');
var tsutils_1 = require('tsutils');

var Rule = /** @class */ (function(_super) {
  __extends(Rule, _super);

  function Rule() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  Rule.prototype.apply = function(sourceFile) {
    return this.applyWithWalker(new NoExternalImportsWalker(sourceFile, Rule.metadata.ruleName, null));
  };
  Rule.FAILURE_STRING = "Can't find this dependency in the packages.json or in " + "related module's package.json.";
  Rule.metadata = {
    ruleName: 'no-external-imports',
    description: 'No exteral imports outside specific module.',
    descriptionDetails:
      'No external imports outside specific module. All module dependencies should be listed in module packages.json \n    or it should be inside one of the used @modules.',
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: [true],
    type: 'functionality',
    hasFix: false,
    typescriptOnly: false
  };
  return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// var MODULE_IMPLIMENTATION = ['client-react', 'client-angular', 'server-ts', 'common'];
var DEPENDENCIES_VARIANTS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
// var MODULE_TAG = '@module';
var NoExternalImportsWalker = /** @class */ (function(_super) {
  __extends(NoExternalImportsWalker, _super);

  function NoExternalImportsWalker() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  NoExternalImportsWalker.prototype.walk = function(sourceFile) {
    var moduleDependencies = new Set();
    var nodeModuleDependencies = new Set();
    for (var _i = 0, _a = tsutils_1.findImports(sourceFile, 1 /* ImportDeclaration */); _i < _a.length; _i++) {
      var name = _a[_i];
      if (!ts.isExternalModuleNameRelative(name.text)) {
        if (!moduleDependencies.size && !nodeModuleDependencies.size) {
          this.getDependencies(sourceFile.fileName, moduleDependencies, nodeModuleDependencies);
        }
        console.log('des', nodeModuleDependencies);
        if (!nodeModuleDependencies.has(name.text)) {
          this.addFailureAtNode(name, Rule.FAILURE_STRING);
        }
      }
    }
  };
  /**
   * Get dependencies of the module and related module
   * @param providedPath
   * @param relatedModule
   */
  NoExternalImportsWalker.prototype.getDependencies = function(
    providedPath,
    moduleDependencies,
    nodeModuleDependencies
  ) {
    var subModuleDependencies = {};
    var dirPath = path.resolve(path.dirname(providedPath));
    var packageJsonPath = this.findFilesystemEntity(dirPath, 'package.json');
    if (typeof packageJsonPath !== 'undefined') {
      this.getDependenciesFromPackageJson(packageJsonPath, moduleDependencies, subModuleDependencies);
    }
    this.checkDependenciesInNodeModules(dirPath, nodeModuleDependencies, subModuleDependencies, moduleDependencies);
  };
  NoExternalImportsWalker.prototype.checkDependenciesInNodeModules = function(
    currentFolderPath,
    nodeModuleDependencies,
    subModuleDependencies,
    packageJsonDependencies
  ) {
    var nodeModulesPath = this.findFilesystemEntity(currentFolderPath, 'test_node_modules');
    if (typeof nodeModulesPath !== 'undefined') {
      this.collectNodeModulesDependencies(
        nodeModulesPath,
        nodeModuleDependencies,
        subModuleDependencies,
        packageJsonDependencies
      );
    }
  };
  NoExternalImportsWalker.prototype.collectNodeModulesDependencies = function(
    currentPath,
    nodeModuleDependencies,
    subModuleDependencies,
    packageJsonDependencies,
    nested
  ) {
    if (nested === void 0) {
      nested = false;
    }
    var nodeModulesFolders = fs.readdirSync(currentPath);
    for (var _i = 0, nodeModulesFolders_1 = nodeModulesFolders; _i < nodeModulesFolders_1.length; _i++) {
      var moduleFolder = nodeModulesFolders_1[_i];
      var stat = fs.lstatSync(path.join(currentPath, moduleFolder));
      if (packageJsonDependencies.has(moduleFolder)) {
        if (stat.isDirectory()) {
          nodeModuleDependencies.add(moduleFolder);
          continue;
        }
        if (stat.isSymbolicLink()) {
          this.getDependenciesFromPackageJson(
            path.join(currentPath, moduleFolder, 'package.json'),
            nodeModuleDependencies
          );
          continue;
        }
      }
      if (subModuleDependencies[moduleFolder]) {
        if (stat.isDirectory()) {
          this.collectNodeModulesDependencies(
            path.join(currentPath, moduleFolder),
            nodeModuleDependencies,
            subModuleDependencies,
            packageJsonDependencies
          );
          continue;
        }
      }
      console.log('Name', moduleFolder);
      console.log('isFolder', stat.isDirectory());
      console.log('Link', stat.isSymbolicLink());
    }
  };
  /**
   *  Parse package.json and get all needed dependencies
   * @param packageJsonPath
   * @param moduleDependencies
   */
  NoExternalImportsWalker.prototype.getDependenciesFromPackageJson = function(
    packageJsonPath,
    moduleDependencies,
    subModuleDependencies
  ) {
    var _this = this;
    // don't use require here to avoid caching
    // remove BOM from file content before parsing
    try {
      var content_1 = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8').replace(/^\uFEFF/, ''));
      DEPENDENCIES_VARIANTS.forEach(function(dependencyVariant) {
        if (typeof content_1[dependencyVariant] !== 'undefined') {
          _this.addDependencies(moduleDependencies, content_1[dependencyVariant], subModuleDependencies);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  /**
   * Add dependency name from package.json to the set and object
   */
  NoExternalImportsWalker.prototype.addDependencies = function(
    moduleDependencies,
    dependencies,
    moduleSubDependencies
  ) {
    for (var name in dependencies) {
      if (dependencies.hasOwnProperty(name)) {
        if (moduleSubDependencies && name.indexOf('@') === 0) {
          var moduleParts = name.split('/');
          moduleSubDependencies[moduleParts[0]] = moduleParts[1];
        }
        moduleDependencies.add(name);
      }
    }
  };
  /**
   * Look for findFilesystemEntity
   * @param current
   */
  NoExternalImportsWalker.prototype.findFilesystemEntity = function(current, name) {
    var prev;
    do {
      var fileName = path.join(current, name);
      if (fs.existsSync(fileName)) {
        return fileName;
      }
      prev = current;
      current = path.dirname(current);
    } while (prev !== current);
    return undefined;
  };
  return NoExternalImportsWalker;
})(Lint.AbstractWalker);
