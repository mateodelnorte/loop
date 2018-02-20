const debug = require('debug')('loop:listDirectories');
const fs = require('fs');
const path = require('path');

function notIgnored (looprc, file) {
  return ! looprc || ! looprc.ignore || looprc.ignore.indexOf(file) === -1;  
}

module.exports = (looprc, dir) => {
  if (looprc && looprc.ignore) debug(`ignoring dirs: ${looprc.ignore}`);
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory() && notIgnored(looprc, file);
  }).map((child) => {
    return path.join(dir, child);
  });
};