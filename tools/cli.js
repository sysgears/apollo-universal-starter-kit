const prog = require('caporal');
const moduleCmd = require('./cli/module');

prog
  .version('1.0.0')
  .command('module', 'Create new Module')
  .alias('m')
  .argument('<module>', 'Module name')
  .argument('[location]', 'Where should new module be created. [both, server, client]', ["both", "server", "client"], 'both')
  .action(moduleCmd);

prog.parse(process.argv);