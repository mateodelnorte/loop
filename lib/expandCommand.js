module.exports = function (dirs, command, options = {}) {
  return dirs.map((dir) => {
    return {
      dir,
      command,
      exitOnError: options.exitOnError,
      exitOnAggregateError: options.exitOnAggregateError,
    }; 
  });
};