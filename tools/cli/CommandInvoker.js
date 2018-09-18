const { MODULE_TEMPLATES, CRUD_TEMPLATES } = require('./config');

/**
 * Class CommandInvoker. Takes all CLI operations and calls certain CLI operation depends of variables.
 */
class CommandInvoker {
  /**
   * Sets CLI operations (functions).
   * @constructor
   *
   * @param addModule - The function for creating a new module.
   * @param deleteModule - The function for deleting existing module.
   */
  constructor(addModule, deleteModule, addCrud, updateSchema) {
    this.addModule = addModule;
    this.deleteModule = deleteModule;
    this.addCrud = addCrud;
    this.updateSchema = updateSchema;
  }

  /**
   * Calls CLI operation with correct location.
   *
   * @param func - The func to call.
   * @param location - The location for a new module [client|server|both].
   * @param args - The function for deleting existing module.
   */
  static runCommand(func, location, ...args) {
    // client
    if (location === 'client' || location === 'both') {
      func('client', ...args);
    }
    // server
    if (location === 'server' || location === 'both') {
      func('server', ...args);
    }
  }

  /**
   * Runs operation (function) for creating a new module.
   */
  runAddModule(args, options, logger) {
    const { moduleName, location = 'both' } = args;
    CommandInvoker.runCommand(this.addModule, location, logger, MODULE_TEMPLATES, moduleName);
  }

  /**
   * Runs operation (function) for creating a new CRUD module.
   */
  runAddCrud(args, options, logger) {
    const { moduleName, tablePrefix, location = 'both' } = args;
    CommandInvoker.runCommand(this.addModule, location, logger, CRUD_TEMPLATES, moduleName, false);
    CommandInvoker.runCommand(this.addCrud, location, logger, CRUD_TEMPLATES, moduleName, tablePrefix);
  }

  /**
   * Runs operation (function) for deleting existing module.
   */
  runDeleteModule(args, options, logger) {
    const { moduleName, location = 'both' } = args;
    CommandInvoker.runCommand(this.deleteModule, location, logger, moduleName);
  }

  /**
   * Runs operation (function) for updating existing module schema.
   */
  runUpdateSchema(args, options, logger) {
    const { moduleName, location = 'both' } = args;
    CommandInvoker.runCommand(this.updateSchema, location, logger, moduleName);
  }
}

module.exports = CommandInvoker;
