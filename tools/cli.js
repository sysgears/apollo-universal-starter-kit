const prog = require('caporal');
const moduleCmd = require('./cli/plugin');

prog
  .version('1.0.0')
  .command('addplugin', 'Create a new Plugin')
  .argument('<module>', 'Plugin name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('addplugin', args, options, logger))
  .command('deleteplugin', 'Delete a Plugin')
  .argument('<module>', 'Plugin name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('deleteplugin', args, options, logger));

prog.parse(process.argv);
