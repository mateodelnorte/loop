module.exports = function (dirs, command) {
  return dirs.map((dir) => {
    return {
      dir,
      command
    }; 
  });
};