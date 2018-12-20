const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  getPackageName,
  getTemplatesPath,
  copyFiles,
  renameFiles,
  computeModulePath,
  getModulesEntryPoint,
  computePackagePath,
  computeModulePackageName,
  addSymlink,
  runPrettier
} = require('../helpers/util');

/**
 * Adds application module to client or server code and adds it to the module list.
 *
 * @param logger - The Logger.
 * @param templatesPath - The path to the templates for a new module.
 * @param moduleName - The name of a new module.
 * @param options - User defined options
 * @param location - The location for a new module [client|server|both].
 * @param finished - The flag about the end of the generating process.
 */
function addModule({ logger, moduleName, module, old, options, location, finished = true }) {
  console.log(temp);

  const packageName = getPackageName(module, old);
  const templatesPath = getTemplatesPath(old);

  copyTemplates();
  mergeWithModules();

  /* Add module steps */

  /**
   * Moves templates to newly created module.
   */
  function copyTemplates() {
    logger.info(`Copying ${packageName} files…`);

    // create new module directory
    const destinationPath = computeModulePath(packageName, old, moduleName);
    const newModule = shell.mkdir('-p', destinationPath);

    // continue only if directory does not jet exist
    if (newModule.code !== 0) {
      logger.error(chalk.red(`The ${moduleName} directory is already exists.`));
      process.exit();
    }
    //copy and rename templates in destination directory
    copyFiles(destinationPath, templatesPath, packageName);
    renameFiles(destinationPath, moduleName);

    logger.info(chalk.green(`✔ The ${packageName} files have been copied!`));
  }

  /**
   * Imports module to 'modules.ts' file.
   */
  function mergeWithModules() {
    // Gets `modules.ts` file path
    const modulesEntry = `${getModulesEntryPoint(module)}/${fs
      .readdirSync(getModulesEntryPoint(module))
      .find(_ => _.includes('modules.ts'))}`;
    let indexContent;

    try {
      // Retrieves the content of the modules.ts
      indexContent =
        `import ${moduleName} from '${computeModulePackageName(moduleName, packageName, old)}';\n` +
        fs.readFileSync(modulesEntry);
    } catch (e) {
      logger.error(chalk.red(`Failed to read ${modulesEntry} file`));
      process.exit();
    }

    // Extracts application modules from the modules.ts
    const appModuleRegExp = /Module\(([^()]+)\)/g;
    const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];

    // Adds a module to app module list
    shell
      .ShellString(indexContent.replace(RegExp(appModuleRegExp, 'g'), `Module(${moduleName}, ${appModules})`))
      .to(modulesEntry);
    runPrettier(modulesEntry);
  }

  function temp() {
    if (!options.old) {
      // get package content
      const packagePath = computePackagePath(location);
      const packageContent = `` + fs.readFileSync(packagePath);

      // extract dependencies
      const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
      const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];

      // insert package and sort
      const dependenciesSorted = dependencies.split(',');
      dependenciesSorted.push(`\n    "${computeModulePackageName(location, options, moduleName)}": "^1.0.0"`);
      dependenciesSorted.sort();

      // add module to package list
      shell
        .ShellString(
          packageContent.replace(
            RegExp(dependenciesRegExp, 'g'),
            `"dependencies": {${dependenciesSorted}},\n  "devDependencies"`
          )
        )
        .to(packagePath);

      addSymlink(location, moduleName);
    }
    if (finished) {
      logger.info(chalk.green(`✔ Module for ${location} successfully created!`));
    }
  }
}

module.exports = addModule;
