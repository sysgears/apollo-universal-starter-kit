require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');
const addModuleCommand = require('./cli/commands/addModule');
const addCrudCommand = require('./cli/commands/addCrud');
const deleteModuleCommand = require('./cli/commands/deleteModule');
const CommandInvoker = require('./cli/CommandInvoker');

const prog = require('caporal');

const commandInvoker = new CommandInvoker(addModuleCommand, addCrudCommand, deleteModuleCommand);

prog
  .version('1.0.0')
  .command('addmodule', 'Create a new Module')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => commandInvoker.runAddModule(args, options, logger))
  .command('addcrud', 'Create a new Module with CRUD')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .argument('[tablePrefix]', 'DB table prefix.')
  .action((args, options, logger) => commandInvoker.runAddCrud(args, options, logger))
  .command('deletemodule', 'Delete a Module')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => commandInvoker.runDeleteModule(args, options, logger));

prog.parse(process.argv);
