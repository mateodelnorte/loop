const async = require('async');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');

module.exports = (commands, cb) => {

  async.map(commands, (cmd, cb) => {
    
    var code = null;

    try {

      console.log(`\n${chalk.cyan(path.basename(cmd.dir))}:`)

      code = execSync(cmd.command, { env: process.env, stdio: 'inherit' });

    } catch (err) {
      // a cmd error isnt a loop error,
      // we just want to output the cmd's output
      let errorMessage = `${chalk.red(path.basename(cmd.dir))} exited with error: ${err.toString()}`;
      console.error(errorMessage);
      return cb(null, { error: errorMessage });
    }

    if (code) {
      let errorMessage = `${chalk.red(path.basename(cmd.dir))} exited with code: ${code}`;
      console.error(errorMessage);
      return cb(null, { err: errorMessage });
    } 

    let success = chalk.green(`${path.basename(cmd.dir)} ✓`);

    console.log(success);
    
    return cb(null, { output: success });

   }, cb);

  }