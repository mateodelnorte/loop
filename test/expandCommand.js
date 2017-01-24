const expandCommand = require('../lib/expandCommand');
const path = require('path');
const should = require('should');

describe('expandCommand', function () {

  it('should create a command for each directory passed', function () {

    const commands = expandCommand([path.resolve('bin'), path.resolve('lib')], 'pwd');

    const firstCommand = commands[0];
    const secondCommand = commands[1]
    
    firstCommand.should.have.property('dir', '/Users/mateodelnorte/development/meta/plugins/loop-things/bin');
    firstCommand.should.have.property('command', '"/Users/mateodelnorte/development/meta/node_modules/.bin/cross-env" pwd');

    secondCommand.should.have.property('dir', '/Users/mateodelnorte/development/meta/plugins/loop-things/lib');
    secondCommand.should.have.property('command', '"/Users/mateodelnorte/development/meta/node_modules/.bin/cross-env" pwd');

  });

});