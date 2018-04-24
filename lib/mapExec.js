const async = require('async');
const chalk = require('chalk');
const exec = require('meta-exec');
const path = require('path');

module.exports = (commands, cb, errorCb) => {

  return async.map(commands, (cmd, cb) => {
    return exec({
      command: cmd.command,
      dir: cmd.dir,
      exitOnError: cmd.exitOnError,
      exitOnAggregateError: cmd.exitOnAggregateError,
    }, cb, errorCb);
  }, cb);

}