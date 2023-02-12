const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const {
  getModulePackageName,
  computeModulePath,
  getModulesEntryPoint,
  computeRootModulesPath,
  computePackagePath,
  computeModulePackageName,
  removeSymlink,
  runPrettier,
} = require('../helpers/util');

/**
 * Removes the module from client, server or both locations and removes the module from the module list.
 *
 * @param logger - The Logger
 * @param packageName - Name of the package the module adding to ([client|server])
 * @param moduleName - The name of a new module
 * @param old - The flag that describes if the command invoked for a new structure or not
 */
function deleteModule(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  // pascalize
  const Module = pascalize(module);
  const startPath = `${__dirname}/../../..`;
  const modulePath = `${startPath}/packages/${location}/src/modules/${module}`;
  const commonGraphqlFile = 'commonGraphql.js';
  const commonGraphqlPath = `${startPath}/packages/${location}/src/modules/common/components/web/${commonGraphqlFile}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${startPath}/packages/${location}/src/modules/`);

    // get module input data
    const path = `${startPath}/packages/${location}/src/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);
    const modules = match[1].split(',').filter(featureModule => featureModule.trim() !== module);

    // remove import module line
    const lines = data
      .toString()
      .split('\n')
      .filter(line => line.match(`import ${module} from './${module}';`) === null);
    fs.writeFileSync(path, lines.join('\n'));

    // remove module from Feature function
    //shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');
    shell
      .ShellString(shell.cat('index.js').replace(RegExp(re, 'g'), `Feature(${modules.toString().trim()})`))
      .to('index.js');

    if (location === 'server') {
      // change to database migrations directory
      shell.cd(`${startPath}/packages/${location}/src/database/migrations`);
      // check if any migrations files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okMigrations = shell.rm(`*_${Module}.js`);
        if (okMigrations) {
          logger.info(chalk.green(`✔ Database migrations files successfully deleted!`));
        }
      }

      // change to database seeds directory
      shell.cd(`${startPath}/packages/${location}/src/database/seeds`);
      // check if any seed files for this module exist
      if (shell.find('.').filter(file => file.search(`_${Module}.js`) > -1).length > 0) {
        let okSeeds = shell.rm(`*_${Module}.js`);
        if (okSeeds) {
          logger.info(chalk.green(`✔ Database seed files successfully deleted!`));
        }
      }
    }

    // continue only if directory does not jet exist
    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }

  if (fs.existsSync(commonGraphqlPath)) {
    const graphqlQuery = `${Module}Query`;
    deleteModuleFromCommonGraphqlFile(module, commonGraphqlPath, graphqlQuery);
  }
}

/// /////// DELETE MODULE STEPS //////////

/**
 * Removes templates from the module.
 */
function deleteTemplates({ logger, moduleName, modulePath, modulePackageName, old }) {
  logger.info(`Deleting ${modulePackageName} files…`);
  // remove module directory
  shell.rm('-rf', modulePath);

  // in new module structure remove root dir if no submodules exist
  if (!old) {
    const rootModulePath = computeRootModulesPath(moduleName);
    if (!shell.ls(rootModulePath).length) {
      shell.rm('-rf', rootModulePath);
    }
  }
  logger.info(chalk.green(`✔ The ${modulePackageName} files of the module ${moduleName} have been deleted!`));
}

/**
 * Removes module from modules entry file.
 */
function removeFromModules({ logger, moduleName, packageName, modulePackageName, old }) {
  // Gets modules entry point file path
  const modulesEntry = getModulesEntryPoint(packageName, old);

  let indexContent;

  try {
    indexContent = fs.readFileSync(modulesEntry);
  } catch (e) {
    logger.error(chalk.red(`Failed to read ${modulesEntry} file`));
    process.exit();
  }

  // Extract application modules
  const appModuleRegExp = /Module\(([^()]+)\)/g;
  const [, appModules] = appModuleRegExp.exec(indexContent) || ['', ''];
  const appModulesWithoutDeleted = appModules.split(',').filter((appModule) => appModule.trim() !== moduleName);

  const contentWithoutDeletedModule = indexContent
    .toString()
    // Remove module from modules list
    .replace(appModuleRegExp, `Module(${appModulesWithoutDeleted.toString().trim()})`)
    // Remove module import
    .replace(
      RegExp(`import ${moduleName} from '${computeModulePackageName(moduleName, modulePackageName, old)}';\n`, 'g'),
      ''
    );

  fs.writeFileSync(modulesEntry, contentWithoutDeletedModule);
  runPrettier(modulesEntry);
}

/**
 * Removes the module from the dependencies list.
 */
function removeDependency({ moduleName, packageName, modulePackageName, old }) {
  // Get package content
  const packagePath = computePackagePath(packageName);
  const packageContent = `${fs.readFileSync(packagePath)}`;

  // Extract dependencies
  const dependenciesRegExp = /"dependencies":\s\{([^()]+)\},\n\s+"devDependencies"/g;
  const [, dependencies] = dependenciesRegExp.exec(packageContent) || ['', ''];

  // Remove package
  const dependenciesWithoutDeleted = dependencies
    .split(',')
    .filter((pkg) => !pkg.includes(computeModulePackageName(moduleName, modulePackageName, old)));

  // Remove module from package list
  shell
    .ShellString(
      packageContent.replace(
        RegExp(dependenciesRegExp, 'g'),
        `"dependencies": {${dependenciesWithoutDeleted}},\n  "devDependencies"`
      )
    )
    .to(packagePath);

  removeSymlink(moduleName, modulePackageName);
}

module.exports = deleteModule;
