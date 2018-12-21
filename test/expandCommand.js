const expandCommand = require('../lib/expandCommand');
const path = require('path');
const should = require('should');
const { expect } = require('chai');

describe('expandCommand', function () {

  it('should create a command for each directory passed', function () {

    const commands = expandCommand([path.resolve('bin'), path.resolve('lib')], 'pwd');

    const firstCommand = commands[0];
    const secondCommand = commands[1]
    
    // firstCommand.should.have.property('dir', 'loop/bin');
    expect(/\/loop\/bin/.test(firstCommand.dir)).to.equal(true);
    firstCommand.should.have.property('command', 'pwd');

    expect(/\/loop\/lib/.test(secondCommand.dir)).to.equal(true);
    secondCommand.should.have.property('command', 'pwd');

  });

});