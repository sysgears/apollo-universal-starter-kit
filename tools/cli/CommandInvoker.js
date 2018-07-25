const addModuleCommand = require('./commands/addModule');
const addCrudCommand = require('./commands/addCrud');

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

  constructor(addModule = addModuleCommand, addCrud = addCrudCommand) {
    this.addModule = addModule;
    this.addCrud = addCrud;
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
}

module.exports = CommandInvoker;
