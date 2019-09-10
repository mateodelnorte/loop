const chalk = require('chalk');
const debug = require('debug')('loop');
const expandCommand = require('../lib/expandCommand');
const getFlag = require('../lib/getFlag');
const getArgsForFlag = require('../lib/getArgsForFlag');
const listDirectories = require('../lib/listDirectories');
const mapExec = require('../lib/mapExec');
const path = require('path');
const util = require('util');
const _ = require('lodash');

module.exports = (options, cb, errorCb) => {
  const cwd = options.dir || process.cwd();

  var dirs = options.directories || listDirectories(options.looprc, cwd);
  var looprc = options['looprc'] || [];

  options.exclude = options.exclude || getArgsForFlag(process.argv, '--exclude') || looprc.exclude;
  options.excludeOnly = options.excludeOnly || getArgsForFlag(process.argv, '--exclude-only') || looprc.excludeOnly;
  options.excludePattern =
    options.excludePattern || getArgsForFlag(process.argv, '--exclude-pattern') || looprc.excludePattern;
  options.exitOnAggregateError =
    options.exitOnAggregateError || getArgsForFlag(process.argv, '--exit-on-aggregate-error');
  options.exitOnError = options.exitOnError || getArgsForFlag(process.argv, '--exit-on-error');
  options.include = options.include || getArgsForFlag(process.argv, '--include') || looprc.include;
  options.includeOnly = options.includeOnly || getArgsForFlag(process.argv, '--include-only') || looprc.includeOnly;
  options.includePattern =
    options.includePattern || getArgsForFlag(process.argv, '--include-pattern') || looprc.includePattern;
  options.parallel = options.parallel || getFlag(process.argv, '--parallel') || looprc.parallel;
  debug(`executing ${util.inspect(options)} ${process.argv}`);

  if (options.excludeOnly) {
    dirs = listDirectories({ ignore: options.excludeOnly }, options.dir);
  } else if (options.exclude) {
    dirs = dirs.filter(dir => {
      return options.exclude.indexOf(path.basename(dir)) === -1;
    });
  } else if (options.excludePattern) {
    const regexp = new RegExp(options.excludePattern);
    dirs = dirs.filter(dir => {
      return !regexp.test(path.relative(cwd, dir));
    });
  }

  if (options.includeOnly) {
    dirs = _.uniq(options.includeOnly);
  } else if (options.include) {
    dirs = _.union(
      dirs,
      options.include.map(i => {
        return path.resolve(cwd, i);
      })
    ).sort();
  } else if (options.includePattern) {
    const regexp = new RegExp(options.includePattern);
    dirs = dirs.filter(dir => {
      return regexp.test(path.relative(cwd, dir));
    });
  }

  const commands = expandCommand(dirs, options.command, {
    exitOnError: options.exitOnError,
    exitOnAggregateError: options.exitOnAggregateError,
  });

  let commandOutputsWithErrors = [];

  mapExec(
    commands,
    options,
    (err, commandOutputs) => {
      if (options.exitOnAggregateError && commandOutputsWithErrors.length > 0) {
        console.log();
        let index = 0;
        console.log(
          `one or more child commands executed by loop encountered an error:\n${commandOutputsWithErrors.reduce(
            (a, b) => {
              return `${a}\n${++index}: ${b}`;
            },
            ''
          )}`
        );
        console.log();
        process.exit(1);
      }

      const results = commandOutputs.reduce((logMessage, commandOutput, index) => {
        const color = commandOutput.error ? 'red' : 'green';
        const code = commandOutput.error && commandOutput.error.code !== 0 ? commandOutput.error.code : null;
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
    },
    error => {
      if (options.exitOnError) {
        console.log(`a child command executed by loop encountered an error:\n${error}`);
        process.exit(1);
      }

      commandOutputsWithErrors.push(error);
    }
  );
};
