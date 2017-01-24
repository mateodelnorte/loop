module.exports = function (args, flag) {
  
  let index = args.indexOf(flag);

  if (index === -1) return undefined;
  
  const found = [];

  let token = args[++index];

  while (token && token.substr(0, 2) !== '--') {
    found.push(token);
    token = args[++index];
  }

  const normalized = found.reduce((prev, curr) => {
    return prev.trim() + curr.trim();
  }, '');

  return normalized.split(',');

}