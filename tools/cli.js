require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');
const addModuleCommand = require('./cli/commands/addModule');
const addCrudCommand = require('./cli/commands/addCrud');
const deleteModuleCommand = require('./cli/commands/deleteModule');
const updateSchemaCommand = require('./cli/commands/updateSchema');
const CommandInvoker = require('./cli/CommandInvoker');

const prog = require('caporal');

const commandInvoker = new CommandInvoker(addModuleCommand, addCrudCommand, deleteModuleCommand, updateSchemaCommand);

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
  // Add CRUD module
  .command('addcrud', 'Create a new Module with CRUD')
  .argument('<moduleName>', 'Module name')
  .argument(
    '[location]',
    'Where should CRUD module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .argument('[tablePrefix]', 'DB table prefix.')
  .action((args, options, logger) => commandInvoker.runAddCrud(args, options, logger))
  // Delete module
  .command('deletemodule', 'Delete a Module')
  .argument('<moduleName>', 'Module name')
  .argument('[location]', 'Where should we delete module. [both, server, client]', ['both', 'server', 'client'], 'both')
  .option('-m', 'Delete migration and seeds')
  .action((args, options, logger) => commandInvoker.runDeleteModule(args, options, logger))
  // Update schema
  .command('updateschema', 'Update Module Schema')
  .argument('<moduleName>', 'Module name')
  .action((args, options, logger) => commandInvoker.runUpdateSchema(args, options, logger));

prog.parse(process.argv);
