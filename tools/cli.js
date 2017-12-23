const prog = require('caporal');
const pluginCmd = require('./cli/plugin');

prog
  .version('1.0.0')
  .command('addplugin', 'Create a new Plugin')
  .argument('<plugin>', 'Plugin name')
  .argument(
    '[location]',
    'Where should new plugin be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => pluginCmd('addplugin', args, options, logger))
  .command('deleteplugin', 'Delete a Plugin')
  .argument('<plugin>', 'Plugin name')
  .argument(
    '[location]',
    'Where should new plugin be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => pluginCmd('deleteplugin', args, options, logger));

prog.parse(process.argv);
