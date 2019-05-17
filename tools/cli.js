const root = __dirname + '/..';

require('@babel/register')({
  root,
  cwd: root,
  configFile: root + '/tools/babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

const prog = require('caporal');
const addModuleCommand = require('./cli/commands/addModule');
const deleteModuleCommand = require('./cli/commands/deleteModule');
const chooseTemplateCommand = require('./cli/commands/chooseTemplate');
const deleteStackCommand = require('./cli/commands/deleteStack');

const CommandInvoker = require('./cli/CommandInvoker');

const commandInvoker = new CommandInvoker(
  addModuleCommand,
  deleteModuleCommand,
  chooseTemplateCommand,
  deleteStackCommand
);

prog
  .version('1.0.0')
  .description('Full info: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/tools/cli.md')
  // Add module
  .command('addmodule', 'Create a new Module.')
  .argument('<moduleName>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .option('-o, --old', 'Old Structure')
  .action((args, options, logger) => commandInvoker.runAddModule(args, options, logger))
  // Delete module
  .command('deletemodule', 'Delete a Module')
  .argument('<moduleName>', 'Module name')
  .argument('[location]', 'Where should we delete module. [both, server, client]', ['both', 'server', 'client'], 'both')
  .option('-o, --old', 'Old Structure')
  .action((args, options, logger) => commandInvoker.runDeleteModule(args, options, logger))
  // Choose stack
  .command('choosestack', 'Choose the stack of technologies for the app')
  .action(() => commandInvoker.runChooseStack())
  .command(
    'deletestack',
    `Delete the stack of technologies for the app.
List of technologies [react, angular, vue, scala, node]`
  )
  .argument('[stackList...]', 'List of technologies [react, angular, vue, scala, node]')
  .option('-l --list', 'Show stack of technologies list')

  .action(({ stackList }, { list }, logger) => {
    commandInvoker.runDeleteStack(stackList, logger, list);
  });

prog.parse(process.argv);
