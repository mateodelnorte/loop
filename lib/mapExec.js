const async = require('async');
const exec = require('child_process').exec;

module.exports = (commands, cb) => {
  async.map(commands, (command, cb) => {
    exec(command, { env: process.env }, (err, stdout, stderr) => {
      if (err) {
        // a command error isnt a loop error,
        // we just want to output the command's output
        return cb(null, { error: err });
      }
      if (stderr.length) {
        // tools like git use this for some reason,
        // seems how it may or may not be an error
        // we'll just send it as output ?
        return cb(null, { output: stderr.trim() });
      }
      return cb(null, { output: stdout.trim() });
    });
  }, cb);
};
