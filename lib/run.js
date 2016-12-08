const async = require('async');
const exec = require('child_process').exec;

module.exports = (commands, cb) => {
  async.map(commands, (command, cb) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`error in command ${command}: ${err}`);
        return;
      }
      if (stderr.length) {
        console.error(`error in command ${command}: ${stderr}`);
        return;
      }
      cb(null, stdout.trim());
    });
  }, cb);
};