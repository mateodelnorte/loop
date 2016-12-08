const async = require('async');
const exec = require('child_process').exec;

module.exports = (commands, cb) => {
  async.map(commands, (command, cb) => {
    exec(command, { env: process.env, shell: process.env.SHELL }, (err, stdout, stderr) => {
      if (err) {
        return cb(null, `${err.code !== 0 ? `Exit code: ${err.code}, ` : ''}${err}`);
      }
      if (stderr.length) {
        return cb(null, `${stderr.trim()}`);
      }
      cb(null, stdout.trim());
    });
  }, cb);
};