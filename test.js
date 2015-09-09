var bulkSymlinkOrCopy = require('./index');
var expect = require('chai').expect;
var fs = require('fs');
var rm = require('rimraf').sync;
var mkdirp = require('mkdirp').sync;

describe('bulkSymlinkOrCopy', function() {
  var cwd = process.cwd();

  beforeEach(function() {
    rm(__dirname + '/tests/fixtures');
    mkdirp(__dirname + '/tests/fixtures');
    process.chdir('tests/fixtures');
  });

  afterEach(function() {
    rm(__dirname + '/tests/fixtures');
    process.chdir(cwd);
  });

  it('does not throw', function() {
    expect(function() {
      bulkSymlinkOrCopy.sync([]);
    }).to.not.throw(Error);
  });

  it('works', function() {
    mkdirp('foo/a');
    mkdirp('bar/a');
    mkdirp('baz/apple/orange/a');
    fs.writeFileSync('foo/a/a.js', '');
    fs.writeFileSync('bar/a/a.js', '');
    fs.writeFileSync('baz/apple/orange/a/a.js', '');

    bulkSymlinkOrCopy.sync([
      {'foo/a': 'result/foo/a'},
      {'bar/a': 'result/a'},
      {'baz/apple/orange/a': 'result/baz/apple/orange/a'}
    ]);

    expect(fs.existsSync('result'), 'result should exist').to.be.true;
  });
});
