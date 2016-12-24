const chalk = require('chalk');
const expandCommand = require('../lib/expandCommand');
const listDirectories = require('../lib/listDirectories');
const mapExec = require('../lib/mapExec');
const _ = require('lodash');

module.exports = (options) => {

  var dirs = options.directories || listDirectories(options.looprc, options.dir);

  if (options.exclude) {
    dirs = dirs.filter((dir) => {
      return options.exclude.indexOf(dir) === -1;
    });
  }

  if (options.excludeOnly) {
    dirs = listDirectories({ ignore: options.excludeOnly }, options.dir)
  }

  if (options.include) {
    dirs = _.union(dirs, options.include).sort();
  }

  if (options.includeOnly) {
    dirs = options.includeOnly;
  }

  const commands = expandCommand(dirs, options.command);

  mapExec(commands, (err, commandOutputs) => {
    const results = commandOutputs.reduce((logMessage, commandOutput, index) => {
      const color = commandOutput.error ? 'red' : 'green';
      const code = commandOutput.error && commandOutput.error.code !== 0 
        ? commandOutput.error.code 
        : null;
      const output = commandOutput.output || commandOutput.error;
      return `${logMessage}\n${output}`; 
    }, '');
    console.log(results)
  });

};