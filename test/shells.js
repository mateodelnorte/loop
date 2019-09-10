const exec = require('child_process').exec;
const mkdirp = require('mkdirp');
const path = require('path');
const should = require('should');
const tmp = require('tmp');
const which = require('which');

const execLoopFactory = ({ shell, cwd }) => {
  const loopBin = path.resolve(__dirname, './../bin/loop');
  return argv =>
    new Promise((resolve, reject) => {
      exec(
        `${loopBin} ${argv}`,
        {
          shell,
          cwd,
        },
        (err, stdout, stderr) => {
          if (err) return reject(err);
          if (stderr.toString().length > 0) return reject(new Error(stderr.toString()));
          return resolve(stdout.toString());
        }
      );
    });
};

describe('shells', function() {
  before(function() {
    this.directoryUnderTest = tmp.dirSync().name;
    const subdirectories = ['lib', 'test', 'docs', 'hello-world', 'hello-foo-bar'];
    subdirectories.forEach(subdirectory => {
      mkdirp.sync(path.resolve(this.directoryUnderTest, subdirectory));
    });
  });

  const shellsToTest = ['sh', 'bash', 'zsh'];
  shellsToTest.forEach(shellUnderTest => {
    describe(shellUnderTest, function() {
      before(function() {
        try {
          this.shellBin = which.sync(shellUnderTest);
        } catch (e) {
          console.log(`${shellUnderTest} not found, skipping tests`);
          return this.skip();
        }

        this.loop = execLoopFactory({
          shell: this.shellBin,
          cwd: this.directoryUnderTest,
        });
      });

      it('should run a command for each directory under cwd', function() {
        return this.loop('pwd').then(results => {
          results.should.containEql('docs ✓');
          results.should.containEql('hello-foo-bar ✓');
          results.should.containEql('hello-world ✓');
          results.should.containEql('lib ✓');
          results.should.containEql('test ✓');
        });
      });

      describe('--include-only', function() {
        it('should run a command only for the specified directories', function() {
          return this.loop('pwd --include-only docs,lib').then(results => {
            results.should.containEql('docs ✓');
            results.should.containEql('lib ✓');
            results.should.not.containEql('hello-foo-bar ✓');
            results.should.not.containEql('hello-world ✓');
            results.should.not.containEql('test ✓');
          });
        });
      });

      describe('--include-pattern', function() {
        it('should run a command only for the directories that match the expression', function() {
          return this.loop("pwd --include-pattern 'hello-.*'").then(results => {
            results.should.containEql('hello-foo-bar ✓');
            results.should.containEql('hello-world ✓');
            results.should.not.containEql('docs ✓');
            results.should.not.containEql('lib ✓');
            results.should.not.containEql('test ✓');
          });
        });
      });

      describe('--exclude-only', function() {
        it('should run a command for all directories except the ones specified', function() {
          return this.loop('pwd --exclude-only docs,lib').then(results => {
            results.should.containEql('hello-foo-bar ✓');
            results.should.containEql('hello-world ✓');
            results.should.containEql('test ✓');
            results.should.not.containEql('docs ✓');
            results.should.not.containEql('lib ✓');
          });
        });
      });

      describe('--exclude-pattern', function() {
        it('should run a command for all directories except the ones that match the expression', function() {
          return this.loop("pwd --exclude-pattern 'hello-.*'").then(results => {
            results.should.containEql('docs ✓');
            results.should.containEql('lib ✓');
            results.should.containEql('test ✓');
            results.should.not.containEql('hello-foo-bar ✓');
            results.should.not.containEql('hello-world ✓');
          });
        });
      });
    });
  });
});
