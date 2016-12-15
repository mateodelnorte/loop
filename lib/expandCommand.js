const debug = require('debug')('loop:expandCommand');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

var nodeModulePaths = require('global-paths')();

function findCrossEnv () {
  
  var nmp = nodeModulePaths.pop();

  if ( ! nmp) throw new Error('could not find cross-env');

  try {

    const p = path.join(nmp, '.bin', 'cross-env');

    debug(`looking for cross-env at ${p}`);

    nmp = fs.statSync(p);

    debug(`found cross-env at ${p}`);

    return p;

  } catch (e) {

    return findCrossEnv();

  }

}

const crossEnvPath = findCrossEnv();

module.exports = function (dirs, command) {
  return dirs.map((dir) => {
    return `cd "${path.resolve(dir)}" && "${crossEnvPath}" ${command}`; 
  });
};