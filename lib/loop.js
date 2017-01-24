const chalk = require('chalk');
const expandCommand = require('../lib/expandCommand');
const listDirectories = require('../lib/listDirectories');
const mapExec = require('../lib/mapExec');
const path = require('path');
const _ = require('lodash');

module.exports = (options, cb) => {

  const cwd = options.dir || process.cwd();

  var dirs = options.directories || listDirectories(options.looprc, cwd);

  if (options.excludeOnly) {
    dirs = listDirectories({ ignore: options.excludeOnly }, options.dir)
  } else if (options.exclude) {
    dirs = dirs.filter((dir) => {
      return options.exclude.indexOf(path.basename(dir)) === -1;
    });
  }

  if (options.includeOnly) {
    dirs = _.uniq(options.includeOnly);
  } else if (options.include) {
    dirs = _.union(dirs, options.include.map((i) => { return path.resolve(cwd, i); })).sort();
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
    if (cb) return cb(null, results);
  });

};