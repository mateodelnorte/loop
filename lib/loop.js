const chalk = require('chalk');
const expandCommand = require('../lib/expandCommand');
const listDirectories = require('../lib/listDirectories');
const mapExec = require('../lib/mapExec');

module.exports = (options) => {

  const dirs = options.directories || listDirectories(options.looprc, options.dir);
  const commands = expandCommand(dirs, options.command);

  mapExec(commands, (err, commandOutputs) => {
    console.log(commandOutputs.reduce((logMessage, commandOutput, index) => {
      const color = commandOutput.error ? 'red' : 'green';
      const code = commandOutput.error && commandOutput.error.code !== 0 
        ? commandOutput.error.code 
        : null;
      const output = commandOutput.output || commandOutput.error;
      return `${logMessage}\n${chalk[color](dirs[index])}${code ? ` (exit code ${code})` : ''}\n${output}\n`; 
    }, ''));
  });

};