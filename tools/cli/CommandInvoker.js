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
   * @param chooseStack - The function for choosing stack of technologies.
   * @param deleteStack - The function for delete stack of technologies.
   */
  constructor(addModule, deleteModule, chooseStack, deleteStack, addCrud, updateSchema) {
    this.addModule = addModule;
    this.deleteModule = deleteModule;
    this.chooseStack = chooseStack;
    this.deleteStack = deleteStack;
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
  static runCommand(func, { location, ...args }) {
    const runFunc = packageName => func({ ...args, packageName });

    if (location === 'both') {
      runFunc('client');
      runFunc('server');
    } else {
      runFunc(location);
    }
  }

  /**
   * Runs operation (function) for creating a new module.
   */
  runAddModule(args, options, logger) {
    runOperation(this.addModule, args, options, logger);
  }

  /**
   * Runs operation (function) for deleting existing module.
   */
  runDeleteModule(args, options, logger) {
    runOperation(this.deleteModule, args, options, logger);
  }

  /**
   * Runs operation (function) for choosing stack of technologies.
   */
  runChooseStack() {
    this.chooseStack();
  }

  /**
   * Runs operation (function) for delete stack of technologies.
   */
  runDeleteStack(args, logger, isShowStackList) {
    this.deleteStack(args, logger, isShowStackList);
  }

  /**
   * Runs operation (function) for creating a new CRUD module.
   */
  runAddCrud(args, options, logger) {
    runOperation(this.addCrud, args, options, logger);
  }

  /**
   * Runs operation (function) for updating existing module schema.
   */
  runUpdateSchema(args, options, logger) {
    runOperation(this.updateSchema, args, options, logger);
  }
}

function runOperation(operation, args, options, logger) {
  const { moduleName, location = 'both' } = args;
  CommandInvoker.runCommand(operation, { location, logger, moduleName, old: !!options.old });
}

module.exports = CommandInvoker;
