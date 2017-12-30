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

function copyFiles(logger, templatePath, plugin, location) {
  logger.info(`Copying ${location} files…`);

  // create new plugin directory
  const mkdir = shell.mkdir(`${__dirname}/../../src/${location}/plugins/${plugin}`);

  // continue only if directory does not jet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../src/${location}/plugins/${plugin}`;
    shell.cp('-R', `${templatePath}/${location}/*`, destinationPath);

    logger.info(`✔ The ${location} files have been copied!`);

    // change to destination directory
    shell.cd(destinationPath);

    // rename files
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        const pluginFile = entry.name.replace('Plugin', plugin.capitalize());
        shell.mv(entry.name, pluginFile);
      }
    });

    // replace plugin names
    shell.ls('-Rl', '.').forEach(entry => {
      if (entry.isFile()) {
        shell.sed('-i', /\$plugin\$/g, plugin, entry.name);
        shell.sed('-i', /\$Plugin\$/g, plugin.toCamelCase().capitalize(), entry.name);
      }
    });

    shell.cd('..');
    // get plugin input data
    const path = `${__dirname}/../../src/${location}/plugins/index.js`;
    let data = fs.readFileSync(path);

    // extract Plugin plugins
    const re = /Plugin\(([^()]+)\)/g;
    const match = re.exec(data);

    // prepend import plugin
    const prepend = `import ${plugin} from './${plugin}';\n`;
    fs.writeFileSync(path, prepend + data);

    // add plugin to Plugin function
    shell.sed('-i', re, `Plugin(${plugin}, ${match[1]})`, 'index.js');

    logger.info(`✔ Plugin for ${location} successfully created!`);
  }
}

function deleteFiles(logger, templatePath, plugin, location) {
  logger.info(`Deleting ${location} files…`);

  const pluginPath = `${__dirname}/../../src/${location}/plugins/${plugin}`;

  if (fs.existsSync(pluginPath)) {
    // create new plugin directory
    shell.rm('-rf', pluginPath);

    // change to destination directory
    shell.cd(`${__dirname}/../../src/${location}/plugins/`);

    // add plugin to Plugin function
    //let ok = shell.sed('-i', `import ${plugin} from '.\/${plugin}';`, '', 'index.js');

    // get plugin input data
    const path = `${__dirname}/../../src/${location}/plugins/index.js`;
    let data = fs.readFileSync(path);

    // extract Plugin plugins
    const re = /Plugin\(([^()]+)\)/g;
    const match = re.exec(data);
    const plugins = match[1].split(',').filter(pluginPlugin => pluginPlugin.trim() !== plugin);

    // remove import plugin line
    const lines = data
      .toString()
      .split('\n')
      .filter(line => line.match(`import ${plugin} from './${plugin}';`) === null);
    fs.writeFileSync(path, lines.join('\n'));

    // remove plugin from Plugin function
    shell.sed('-i', re, `Plugin(${plugins.toString().trim()})`, 'index.js');

    // continue only if directory does not jet exist
    logger.info(`✔ Plugin for ${location} successfully deleted!`);
  } else {
    logger.info(`✔ Plugin ${location} location for ${pluginPath} wasn't found!`);
  }
}

module.exports = (action, args, options, logger) => {
  const templatePath = `${__dirname}/../templates/plugin`;

  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested location for ${args.location} wasn't found.`);
    process.exit(1);
  }

  // client
  if (args.location === 'client' || args.location === 'both') {
    if (action === 'addplugin') {
      copyFiles(logger, templatePath, args.plugin, 'client');
    } else if (action === 'deleteplugin') {
      deleteFiles(logger, templatePath, args.plugin, 'client');
    }
  }

  // server
  if (args.location === 'server' || args.location === 'both') {
    if (action === 'addplugin') {
      copyFiles(logger, templatePath, args.plugin, 'server');
    } else if (action === 'deleteplugin') {
      deleteFiles(logger, templatePath, args.plugin, 'server');
    }
  }
};
