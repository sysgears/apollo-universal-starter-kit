const addModuleCommand = require('./commands/addModule');
const addCrudCommand = require('./commands/addCrud');

class CommandInvoker {
  static get moduleTemplatePath() {
    return `${__dirname}/../templates/module`;
  }

  static get crudTemplatePath() {
    return `${__dirname}/../templates/crud`;
  }

  constructor(addModule = addModuleCommand, addCrud = addCrudCommand) {
    this.addModule = addModule;
    this.addCrud = addCrud;
  }

  runAddCrud(args, options, logger) {
    const { module, location = 'both', tablePrefix = '' } = args;
    // client
    if (location === 'client' || location === 'both') {
      this.addCrud(logger, CommandInvoker.crudTemplatePath, module, tablePrefix, 'client');
    }

    // server
    if (location === 'server' || location === 'both') {
      this.addCrud(logger, CommandInvoker.crudTemplatePath, module, tablePrefix, 'server');
    }
  }

  runAddModule(args, options, logger) {
    const { module, location = 'both' } = args;
    // client
    if (location === 'client' || location === 'both') {
      this.addModule(logger, CommandInvoker.moduleTemplatePath, module, 'client');
    }

    // server
    if (location === 'server' || location === 'both') {
      this.addModule(logger, CommandInvoker.moduleTemplatePath, module, 'server');
    }
  }
}

module.exports = CommandInvoker;
