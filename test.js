var bulkSymlinkOrCopy = require('./index');
var expect = require('chai').expect;
var fs = require('fs');
var rm = require('rimraf').sync;
var mkdirp = require('mkdirp').sync;

function absPath(file) {
  return process.cwd() + '/' + file;
}

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
      {'foo/a/a.js': 'result/foo/a/a.js'},
      {'bar/a/a.js': 'result/bar/a/a/.js'},
      {'baz/apple/orange/a/a.js': 'result/baz/apple/orange/a/a.js'}
    ]);

    expect(fs.existsSync('result'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/foo/a/a.js'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/bar/a/a.js'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/baz/apple/orange/a/a.js'), 'result should exist').to.be.true;
  });

  it('works with absolute paths', function() {
    mkdirp('foo/a');
    mkdirp('bar/a');
    mkdirp('baz/apple/orange/a');
    var files = ['foo/a/a.js', 'bar/a/a.js', 'baz/apple/orange/a/a.js'];
    var results = ['result/foo/a/a.js', 'result/bar/a/a/.js', 'result/baz/apple/orange/a/a.js'];
    files.forEach(function(file) {
      fs.writeFileSync(file, '');
    });

    var srcAbsPaths = files.map(absPath);
    var destAbsPaths = results.map(absPath);
    var test = srcAbsPaths.map(function(srcDir, i) {
      var obj = {};
      obj[srcDir] = destAbsPaths[i];
      return obj;
    });

    bulkSymlinkOrCopy.sync(test);
    expect(fs.existsSync('result'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/foo/a/a.js'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/bar/a/a.js'), 'result should exist').to.be.true;
    expect(fs.existsSync('result/baz/apple/orange/a/a.js'), 'result should exist').to.be.true;
  });

  it('throws if paths are mismatched', function() {
    mkdirp('foo/a');
    mkdirp('bar/a');
    mkdirp('baz/apple/orange/a');
    var files = ['foo/a/a.js', 'bar/a/a.js', 'baz/apple/orange/a/a.js'];
    var results = ['result/foo/a/a.js', 'result/bar/a/a/.js', 'result/baz/apple/orange/a/a.js'];
    files.forEach(function(file) {
      fs.writeFileSync(file, '');
    });

    var srcAbsPaths = files.map(absPath);
    var test = srcAbsPaths.map(function(srcDir, i) {
      var obj = {};
      obj[srcDir] = results[i];
      return obj;
    });

    expect(function() {
      bulkSymlinkOrCopy.sync(test);
    }).to.throw(/Mixed relative and absoulte paths encountered./);

  });
});
