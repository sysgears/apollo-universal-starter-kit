"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var fs = require("fs");
var path = require("path");
var tsutils_1 = require("tsutils");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoExternalImportsWalker(sourceFile, Rule.metadata.ruleName, null));
    };
    Rule.FAILURE_STRING = "Can't find this dependency in the packages.json or in " +
        "related module's package.json.";
    Rule.metadata = {
        ruleName: 'no-external-imports',
        description: "No exteral imports outside specific module.",
        descriptionDetails: "No external imports outside specific module. All module dependencies should be listed in module packages.json \n    or it should be inside one of the used @modules.",
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        hasFix: false,
        typescriptOnly: false
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MODULE_IMPLIMENTATION = [
    'client-react',
    'client-angular',
    'server-ts',
    'common'
];
var DEPENDENCIES_VARIANTS = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies'
];
var MODULE_TAG = '@module';
var NoExternalImportsWalker = /** @class */ (function (_super) {
    __extends(NoExternalImportsWalker, _super);
    function NoExternalImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoExternalImportsWalker.prototype.walk = function (sourceFile) {
        var dependencies;
        for (var _i = 0, _a = tsutils_1.findImports(sourceFile, tsutils_1.ImportKind.ImportDeclaration); _i < _a.length; _i++) {
            var name = _a[_i];
            if (!ts.isExternalModuleNameRelative(name.text)) {
                if (dependencies === undefined) {
                    dependencies = this.getDependencies(sourceFile.fileName);
                }
                if (!dependencies.has(name.text)) {
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
    NoExternalImportsWalker.prototype.getDependencies = function (providedPath, relatedModule) {
        if (relatedModule === void 0) { relatedModule = false; }
        var moduleDependencies = new Set();
        var nodeModuleDependencies = new Set();
        var dirPath = relatedModule ? providedPath : path.resolve(path.dirname(providedPath));
        var packageJsonPath = this.findFilesystemEntity(dirPath, 'package.json');
        if (typeof packageJsonPath !== 'undefined') {
            this.getDependenciesFromPackageJson(packageJsonPath, moduleDependencies);
        }
        this.checkDependenciesInNodeModules(dirPath, nodeModuleDependencies, moduleDependencies);
        return moduleDependencies;
    };
    NoExternalImportsWalker.prototype.checkDependenciesInNodeModules = function (currentFolderPath, nodeModuleDependencies, packageJsonDependencies) {
        var nodeModulesPath = this.findFilesystemEntity(currentFolderPath, 'test_node_modules');
        if (typeof nodeModulesPath !== 'undefined') {
            var nodeModulesFolders = fs.readdirSync(nodeModulesPath);
            nodeModulesFolders.forEach(function (element) {
                var stat = fs.lstatSync(path.join(nodeModulesPath, element));
                console.log('Name', element);
                console.log('isFolder', stat.isDirectory());
                console.log('Link', stat.isSymbolicLink());
            });
            console.log('nodeModulesFolders', nodeModulesFolders);
        }
    };
    /**
     *  Parse package.json and get all needed dependencies
     * @param packageJsonPath
     * @param moduleDependencies
     */
    NoExternalImportsWalker.prototype.getDependenciesFromPackageJson = function (packageJsonPath, moduleDependencies) {
        var _this = this;
        // don't use require here to avoid caching
        // remove BOM from file content before parsing
        try {
            var content_1 = JSON.parse(fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, ""));
            DEPENDENCIES_VARIANTS.forEach(function (dependencyVariant) {
                if (typeof content_1[dependencyVariant] !== 'undefined') {
                    _this.addDependencies(moduleDependencies, content_1[dependencyVariant]);
                }
            });
        }
        catch (e) { }
    };
    /**
     * Add dependency name from package.json to the set
     * @param moduleDependencies
     * @param dependencies
     */
    NoExternalImportsWalker.prototype.addDependencies = function (moduleDependencies, dependencies) {
        for (var name in dependencies) {
            if (dependencies.hasOwnProperty(name)) {
                moduleDependencies.add(name);
            }
        }
    };
    /**
     * Look for findFilesystemEntity
     * @param current
     */
    NoExternalImportsWalker.prototype.findFilesystemEntity = function (current, name) {
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
}(Lint.AbstractWalker));
