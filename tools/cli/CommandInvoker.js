const { MODULE_TEMPLATES, MODULE_TEMPLATES_OLD } = require('./config');

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
  constructor(addModule, deleteModule) {
    this.addModule = addModule;
    this.deleteModule = deleteModule;
  }

  /**
   * Calls CLI operation with correct location.
   *
   * @param func - The func to call.
   * @param location - The location for a new module [client|server|both].
   * @param args - The function for deleting existing module.
   */
  static runCommand(func, options, location, ...args) {
    // client
    if (location === 'client' || location === 'both') {
      func(...args, options, options.old ? 'client' : 'client-react');
    }
    // server
    if (location === 'server' || location === 'both') {
      func(...args, options, options.old ? 'server' : 'server-ts');
    }
  }

  /**
   * Runs operation (function) for creating a new module.
   */
  runAddModule(args, options, logger) {
    const { moduleName, location = 'both' } = args;
    CommandInvoker.runCommand(
      this.addModule,
      options,
      location,
      logger,
      options.old ? MODULE_TEMPLATES_OLD : MODULE_TEMPLATES,
      moduleName
    );
  }

  /**
   * Runs operation (function) for deleting existing module.
   */
  runDeleteModule(args, options, logger) {
    const { moduleName, location = 'both' } = args;
    CommandInvoker.runCommand(this.deleteModule, options, location, logger, moduleName);
  }
}

module.exports = CommandInvoker;
