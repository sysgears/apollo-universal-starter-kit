const { MODULE_TEMPLATES } = require('./config');

class CommandInvoker {
  static runCommand(func, location, ...args) {
    // client
    if (location === 'client' || location === 'both') {
      func(...args, 'client');
    }
    // server
    if (location === 'server' || location === 'both') {
      func(...args, 'server');
    }
  }

  constructor(addModule, deleteModule) {
    this.addModule = addModule;
    this.deleteModule = deleteModule;
  }

  runAddModule(args, options, logger) {
    const { module, location = 'both' } = args;
    CommandInvoker.runCommand(this.addModule, location, logger, MODULE_TEMPLATES, module);
  }

  runDeleteModule(args, options, logger) {
    const { module, location = 'both' } = args;
    CommandInvoker.runCommand(this.deleteModule, location, logger, module, options);
  }
}

module.exports = CommandInvoker;
