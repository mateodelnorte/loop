const loop = require('../lib/loop');
const should = require('should');

describe('loop', function () {

  it('should run a command for each directory under cwd', function () {

    loop({
      command: 'pwd'
    }, (err, results) => {
      results.should.containEql('.git ✓');
      results.should.containEql('bin ✓');
      results.should.containEql('lib ✓');
      results.should.containEql('node_modules ✓');
      results.should.containEql('support ✓');
      results.should.containEql('test ✓');
    })

  });

});