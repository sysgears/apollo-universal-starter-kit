const chalk = require('chalk');
const { spawn } = require('child_process');

function installDependency({ logger, moduleName }) {
  const command = spawn('yarn');

  command.stdout.on('data', data => {
    logger.info(data.toString());
  });

  command.on('exit', () => {
    logger.info();
    console.log(chalk.green(`✔ Dependency for the module ${moduleName} has been successfully (un)installed!`));
  });
}

module.exports = installDependency;
