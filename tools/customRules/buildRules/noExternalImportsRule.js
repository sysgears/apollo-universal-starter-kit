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
                if (dependencies.has('is_module') && !dependencies.has(name.text)) {
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
        var _this = this;
        if (relatedModule === void 0) { relatedModule = false; }
        var moduleDependencies = new Set();
        var relatedModuleDependencies = new Set();
        var dirPath = relatedModule ? providedPath : path.resolve(path.dirname(providedPath));
        var packageJsonPath = this.findPackageJson(dirPath);
        if (typeof packageJsonPath !== 'undefined') {
            this.getDependenciesFromPackageJson(packageJsonPath, moduleDependencies);
            if (!relatedModule) {
                moduleDependencies.forEach(function (dependency) {
                    if (dependency.includes(MODULE_TAG)) {
                        var _a = dependency.split('/'), moduleName_1 = _a[1];
                        var moduleNames = MODULE_IMPLIMENTATION
                            .filter(function (moduleImplimentationName) { return moduleName_1.includes(moduleImplimentationName); })
                            .map(function (moduleImplimentationName) { return ({
                            moduleImplimentationName: moduleImplimentationName,
                            moduleGroupName: moduleName_1.replace("-" + moduleImplimentationName, '')
                        }); });
                        var relatedModulePath = moduleNames.length === 1 ?
                            _this.getRelatedModulePath(packageJsonPath, moduleNames[0].moduleGroupName, moduleNames[0].moduleImplimentationName) : '';
                        if (relatedModulePath) {
                            relatedModuleDependencies = _this.getDependencies(relatedModulePath, true);
                        }
                    }
                });
            }
        }
        relatedModuleDependencies.forEach(moduleDependencies.add, moduleDependencies);
        return moduleDependencies;
    };
    /**
     *  Parse package.json and get all needed dependencies
     * @param packageJsonPath
     * @param moduleDependencies
     */
    NoExternalImportsWalker.prototype.getDependenciesFromPackageJson = function (packageJsonPath, moduleDependencies) {
        // don't use require here to avoid caching
        // remove BOM from file content before parsing
        var content = JSON.parse(fs.readFileSync(packageJsonPath, "utf8").replace(/^\uFEFF/, ""));
        if (content.name !== undefined && content.name.includes(MODULE_TAG)) {
            moduleDependencies.add('is_module');
        }
        if (typeof content.dependencies !== 'undefined') {
            this.addDependencies(moduleDependencies, content.dependencies);
        }
        if (typeof content.peerDependencies !== 'undefined') {
            this.addDependencies(moduleDependencies, content.peerDependencies);
        }
        if (content.devDependencies !== undefined) {
            this.addDependencies(moduleDependencies, content.devDependencies);
        }
        if (content.optionalDependencies !== undefined) {
            this.addDependencies(moduleDependencies, content.optionalDependencies);
        }
    };
    /**
     * Get path of the related module, which is specified in module package.json
     * @param packageJsonPath
     * @param moduleGroupName
     * @param moduleImplimentationName
     */
    NoExternalImportsWalker.prototype.getRelatedModulePath = function (packageJsonPath, moduleGroupName, moduleImplimentationName) {
        var modulesRootPath = this.getModulesRootPath(packageJsonPath);
        return fs.existsSync(modulesRootPath) ? modulesRootPath + "/" + moduleGroupName + "/" + moduleImplimentationName : '';
    };
    /**
     * Get path of the modules folder, from path of where related module package.json situated
     * /modules/modulesGroup/moduleImplimentation/package.json -> /modules
     * @param packageJsonPath
     */
    NoExternalImportsWalker.prototype.getModulesRootPath = function (packageJsonPath) {
        return path.join(path.dirname(packageJsonPath), '..', '..');
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
     * Look for module packages.json path
     * @param current
     */
    NoExternalImportsWalker.prototype.findPackageJson = function (current) {
        var prev;
        do {
            var fileName = path.join(current, "package.json");
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
