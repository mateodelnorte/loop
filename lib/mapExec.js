const async = require('async');
const chalk = require('chalk');
const exec = require('meta-exec');
const path = require('path');

module.exports = (commands, cb) => {

  return async.map(commands, (cmd, cb) => {
    return exec({
      command: cmd.command,
      dir: cmd.dir,
      exitOnError: cmd.exitOnError,
      exitOnAggregatedError: cmd.exitOnAggregatedError,
    }, cb);
  }, cb);

}