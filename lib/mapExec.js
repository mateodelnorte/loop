const async = require('async');
const chalk = require('chalk');
const exec = require('@essential-projects/meta-exec');
const path = require('path');

module.exports = (commands, cb) => {

  async.map(commands, (cmd, cb) => {
    exec({
      command: cmd.command,
      dir: cmd.dir
    }, cb);
  }, cb);

}