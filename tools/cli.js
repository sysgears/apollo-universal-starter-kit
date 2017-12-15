require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');

const prog = require('caporal');
const moduleCmd = require('./cli/module');

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
  .action((args, options, logger) => moduleCmd('addmodule', args, options, logger))
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
  .command('deletemodule', 'Delete a Module')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('deletemodule', args, options, logger))
  .command('updateschema', 'Update Module Schema')
  .argument('<module>', 'Module name')
  .action((args, options, logger) => moduleCmd('updateschema', args, options, logger));

prog.parse(process.argv);
