const path = require('path');

const crossEnvPath = path.resolve(__dirname, '..', 'node_modules', '.bin', 'cross-env');

module.exports = function (dirs, command) {
  return dirs.map((dir) => {
    return `cd "${path.resolve(dir)}" && "${crossEnvPath}" ${command}`; 
  });
};