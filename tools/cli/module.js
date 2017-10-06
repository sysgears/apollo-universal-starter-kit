const shell = require('shelljs');
const fs = require('fs');

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function copyFiles(logger, templatePath, module, location) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  const mkdir = shell.mkdir(`${__dirname}/../../src/${location}/modules/${module}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../src/${location}/modules/${module}`;
    shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

    logger.info(`✔ The ${location} files have been copied!`);

    // change to destination directory
    shell.cd(destinationPath);

    // rename files
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        const moduleFile = entry.name.replace('Module', module.capitalize());
        shell.mv(entry.name, moduleFile);
      }
    });

    // replace module names
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        shell.sed('-i', /\$module\$/g, module, entry.name);
        shell.sed('-i', /\$Module\$/g, module.toCamelCase().capitalize(), entry.name);
      }
    });

    shell.cd('..');
    // get module input data
    const path = `${__dirname}/../../src/${location}/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);

    // prepend import module
    const prepend = `import ${module} from './${module}';\n`;
    fs.writeFileSync(path, prepend + data);

    // add module to Feature function
    shell.sed('-i', re, `Feature(${module}, ${match[1]})`, 'index.js');

    logger.info(`✔ Module for ${location} successfully created!`);
  }
}

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  const modulePath = `${__dirname}/../../src/${location}/modules/${module}`;

  if (fs.existsSync(modulePath)) {
    // create new module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${__dirname}/../../src/${location}/modules/`);

    // add module to Feature function
    //let ok = shell.sed('-i', `import ${module} from '.\/${module}';`, '', 'index.js');

    // get module input data
    const path = `${__dirname}/../../src/${location}/modules/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);
    const modules = match[1].split(',').filter(featureModule => featureModule.trim() !== module);

    // remove import module line
    const lines = data
      .toString()
      .split('\n')
      .filter(line => line.match(`import ${module} from './${module}';`) === null);
    fs.writeFileSync(path, lines.join('\n'));

    // remove module from Feature function
    shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');

    // continue only if directory does not jet exist
    logger.info(`✔ Module for ${location} successfully deleted!`);
  } else {
    logger.info(`✔ Module ${location} location for ${modulePath} wasn't found!`);
  }
}

module.exports = (action, args, options, logger) => {
  const templatePath = `${__dirname}/../templates/module`;

  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested location for ${args.location} wasn't found.`);
    process.exit(1);
  }

  // client
  if (args.location === 'client' || args.location === 'both') {
    if (action === 'addmodule') {
      copyFiles(logger, templatePath, args.module, 'client');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, args.module, 'client');
    }
  }

  // server
  if (args.location === 'server' || args.location === 'both') {
    if (action === 'addmodule') {
      copyFiles(logger, templatePath, args.module, 'server');
    } else if (action === 'deletemodule') {
      deleteFiles(logger, templatePath, args.module, 'server');
    }
  }
};
