const debug = require('debug')('loop:expandCommand');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

function findCrossEnv () {
  // TODO make recursive or loop
  var crossEnvPath = 'cross-env';

  try {
    crossEnvPath = path.join(cp.execSync('npm bin').toString().trim(), 'cross-env');
  } catch (e) {}

  debug(`looking for cross-env in ${crossEnvPath}`);

  try {
    fs.statSync(crossEnvPath);
    return crossEnvPath
  } catch (e) {}

  const index = crossEnvPath.lastIndexOf('/node_modules');

  crossEnvPath = `${crossEnvPath.slice(0, index)}/..${crossEnvPath.slice(index)}`;

  debug(`looking for cross-env in ${crossEnvPath}`);

  try {
    fs.statSync(crossEnvPath);
    return crossEnvPath
  } catch (e) {}

  index = crossEnvPath.lastIndexOf('/node_modules');

  crossEnvPath = `${crossEnvPath.slice(0, index)}/../..${crossEnvPath.slice(index)}`;

  debug(`looking for cross-env in ${crossEnvPath}`);

  try {
    fs.statSync(crossEnvPath);
    return crossEnvPath
  } catch (e) {}

  throw new Error('could not find cross-env');
}

const crossEnvPath = findCrossEnv();

module.exports = function (dirs, command) {
  return dirs.map((dir) => {
    return `cd "${path.resolve(dir)}" && "${crossEnvPath}" ${command}`; 
  });
};