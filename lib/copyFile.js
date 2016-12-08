const fs = require('fs');

module.exports = (from, to) => {
  return fs.createReadStream(from).pipe(fs.createWriteStream(to));
};