require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');
const prog = require('caporal');

const addModuleCommand = require('./cli/commands/addModule');
const deleteModuleCommand = require('./cli/commands/deleteModule');
const CommandInvoker = require('./cli/CommandInvoker');

const commandInvoker = new CommandInvoker(addModuleCommand, deleteModuleCommand);

const moduleCmd = require('./cli/module');

prog
  .version('1.0.0')
  .description('Full info: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI')
  // Add module
  .command('addmodule', 'Create a new Module.')
  .argument('<moduleName>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => commandInvoker.runAddModule(args, options, logger))
  // Delete module
  .command('deletemodule', 'Delete a Module')
  .argument('<moduleName>', 'Module name')
  .argument('[location]', 'Where should we delete module. [both, server, client]', ['both', 'server', 'client'], 'both')
  .action((args, options, logger) => commandInvoker.runDeleteModule(args, options, logger))
  .action((args, options, logger) => moduleCmd('addmodule', args, options, logger))
  // Add crud
  .command('addcrud', 'Create a new Module with CRUD')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .argument('[tablePrefix]', 'DB table prefix.')
  .action((args, options, logger) => moduleCmd('addcrud', args, options, logger))
  .action((args, options, logger) => moduleCmd('deletemodule', args, options, logger))
  // Update schema
  .command('updateschema', 'Update Module Schema')
  .argument('<module>', 'Module name')
  .action((args, options, logger) => moduleCmd('updateschema', args, options, logger));

prog.parse(process.argv);
