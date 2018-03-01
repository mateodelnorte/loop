const chalk = require('chalk');
const expandCommand = require('../lib/expandCommand');
const getArgsForFlag = require('../lib/getArgsForFlag'); 
const listDirectories = require('../lib/listDirectories');
const mapExec = require('../lib/mapExec');
const path = require('path');
const _ = require('lodash');

module.exports = (options, cb, errorCb) => {

  const cwd = options.dir || process.cwd();

  var dirs = options.directories || listDirectories(options.looprc, cwd);

  options.exclude = options.exclude || getArgsForFlag(process.argv, '--exclude'),
  options.excludeOnly = options.excludeOnly || getArgsForFlag(process.argv, '--exclude-only'),
  options.include = options.include || getArgsForFlag(process.argv, '--include'),
  options.includeOnly = options.includeOnly || getArgsForFlag(process.argv, '--include-only'),
  options.exitOnError = options.exitOnError || getArgsForFlag(process.argv, '--exit-on-error'),
  options.exitOnAggregatedErrors = options.exitOnAggregatedErrors || getArgsForFlag(process.argv, '--exit-on-aggregated-errors')

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

  const commands = expandCommand(dirs, options.command, {
    exitOnError: options.exitOnError,
    exitOnAggregatedError: options.exitOnAggregatedError,
  });

  let commandOutputsWithErrors = [];

  mapExec(commands, (err, commandOutputs) => {

    if (options.exitOnAggregatedError && commandOutputsWithErrors.length > 0) {
      console.log(`one or more child commands executed by loop encountered an error:\n${commandOutputsWithErrors.join('\n')}`);
      process.exit(1);
    }

    const results = commandOutputs.reduce((logMessage, commandOutput, index) => {
      const color = commandOutput.error ? 'red' : 'green';
      const code = commandOutput.error && commandOutput.error.code !== 0 
        ? commandOutput.error.code 
        : null;
      const output = commandOutput.output || commandOutput.error;

      if (commandOutput.error) {
        if (options.exitOnError) {
          console.log(`a child command executed by loop encountered an error:\n${commandOutput.error}`);
          process.exit(1);
        }
        commandOutputsWithErrors.push(commandOutput.error);
      }

      if (code && options.exitOnError) {
        process.exit(code);
      }

      return `${logMessage}\n${output}`; 
    }, '');

    if (cb) return cb(null, results);

  }, (error) => {

    if (options.exitOnError) {
      console.log(`a child command executed by loop encountered an error:\n${commandOutput.error}`);
      process.exit(1);
    }

    commandOutputsWithErrors.push(error);
  });

};