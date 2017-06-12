const shell = require('shelljs');
const fs = require('fs');

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function copyFiles(logger, templatePath, module, location) {
  logger.info(`Copying ${location} files…`);

  shell.mkdir(`${__dirname}/../../src/${location}/modules/${module}`);

  const destinationPath = `${__dirname}/../../src/${location}/modules/${module}`;
  shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

  logger.info(`✔ The ${location} files have been copied!`);


  // Replace variable values in all files
  shell.cd(destinationPath);

  // rename files
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      const moduleFile = entry.name.replace('module', module);
      shell.mv(entry.name, moduleFile);
    }
  });

  // replace module names
  shell.ls('-Rl', '.').forEach(entry => {
    if (entry.isFile()) {
      shell.sed('-i', `\\[module\\]`, module, entry.name);
      shell.sed('-i', `\\[Module\\]`, module.toCamelCase().capitalize(), entry.name);
      shell.sed('-i', `\\[Module\\]`, module.toCamelCase().capitalize(), entry.name);
    }
  });
}

module.exports = (args, options, logger) => {

  const templatePath = `${__dirname}/../../src/templates/module`;

  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested location for ${args.location} wasn't found.`);
    process.exit(1);
  }

  // client
  if (args.location === 'client' || args.location === 'both') {
    copyFiles(logger, templatePath, args.module, 'client');
  }

  // server
  if (args.location === 'server' || args.location === 'both') {
    copyFiles(logger, templatePath, args.module, 'server');
  }

  logger.info('✔Module successfully created!');
};