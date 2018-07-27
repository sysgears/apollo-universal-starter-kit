class CommandInvoker {
  static get moduleTemplatePath() {
    return `${__dirname}/../templates/module`;
  }

  static get crudTemplatePath() {
    return `${__dirname}/../templates/crud`;
  }

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

  constructor(addModule, addCrud, deleteModule) {
    this.addModule = addModule;
    this.addCrud = addCrud;
    this.deleteModule = deleteModule;
  }

  runAddCrud(args, options, logger) {
    const { module, tablePrefix = '' } = args;
    // server - is only available location for addCrud, client in development
    CommandInvoker.runCommand(this.addCrud, 'server', logger, CommandInvoker.crudTemplatePath, module, tablePrefix);
  }

  runAddModule(args, options, logger) {
    const { module, location = 'both' } = args;
    CommandInvoker.runCommand(this.addModule, location, logger, CommandInvoker.moduleTemplatePath, module);
  }

  runDeleteModule(args, options, logger) {
    const { module, location = 'both' } = args;
    CommandInvoker.runCommand(this.deleteModule, location, logger, module, options);
  }
}

module.exports = CommandInvoker;
