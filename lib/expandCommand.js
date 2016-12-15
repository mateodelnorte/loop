const debug = require('debug')('loop:expandCommand');
const findModuleBin = require('find-module-bin');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const crossEnvPath = findModuleBin('cross-env');

module.exports = function (dirs, command) {
  return dirs.map((dir) => {
    return `cd "${path.resolve(dir)}" && "${crossEnvPath}" ${command}`; 
  });
};