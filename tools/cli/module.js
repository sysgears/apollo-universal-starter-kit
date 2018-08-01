const fs = require('fs');
const chalk = require('chalk');
const addModule = require('./commands/addModule');
const deleteModule = require('./commands/deleteModule');
const updateSchema = require('./commands/updateSchema');

module.exports = (action, args, options, logger) => {
  const module = args.module;
  let location = 'both';
  if (args.location) {
    location = args.location;
  }
  let tablePrefix = '';
  if (args.tablePrefix) {
    tablePrefix = args.tablePrefix;
  }
  console.log(tablePrefix);
  let templatePath = `${__dirname}/../templates/module`;
  if (action === 'addcrud') {
    templatePath = `${__dirname}/../templates/crud`;
  }

  if (!fs.existsSync(templatePath)) {
    logger.error(chalk.red(`The requested location for ${location} not found.`));
    process.exit(1);
  }

  // client
  if (location === 'client' || location === 'both') {
    if (action === 'addmodule' || action === 'addcrud') {
      addModule(logger, templatePath, module, action, tablePrefix, 'client');
    } else if (action === 'deletemodule') {
      deleteModule(logger, templatePath, module, 'client');
    }
  }

  // server
  if (location === 'server' || location === 'both') {
    if (action === 'addmodule' || action === 'addcrud') {
      addModule(logger, templatePath, module, action, tablePrefix, 'server');
    } else if (action === 'deletemodule') {
      deleteModule(logger, templatePath, module, 'server');
    }
  }

  // update schema
  if (action === 'updateschema') {
    updateSchema(logger, module);
  }
};
