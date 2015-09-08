var os = require('os');
var path = require('path');
var rm = require('rimraf').sync;
var mkdirp = require('mkdirp').sync;
var exists = require('exists-sync');
var tmp = os.tmpdir();
var benchPath = path.join(tmp, '__symlink-or-copy-benchmark__');
var fs = require('fs');

module.exports = function(dir, resultDir, count) {
  var fullPath = path.join(benchPath, dir);
  var files = makePaths(fullPath, count);
  var results = path.join(benchPath, resultDir);
  var resultFiles = resultPaths(files, dir, resultDir);

  mkdirp(results);

  return {
    resultFiles: resultFiles,
    resultPath: results,
    files: files,

    onCycle: function() {
      rm(results);
      seedResultDirectories(resultFiles);
    },

    setup: function() {
      rm(results);
      mkdirp(fullPath);
      makeFiles(files);
      seedResultDirectories(resultFiles);
    }
  };
};

function alphabet() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
}


function multipleChar(char) {
  var pieces = char.split('');
  pieces.push(pieces[0]);
  return pieces.join(path.sep);
}

function makePaths(fullPath, count) {
  var alphaPointer = 0;
  var benchDir;
  var benchFile;
  count = count || 4000;
  var alpha = alphabet();

  return Array.apply(null, Array(count)).map(function(_, i) {
    if (alphaPointer === 26) {
      alphaPointer = 0;
      alpha = alpha.map(multipleChar);
    }
    benchDir = path.join(fullPath, alpha[alphaPointer]);
    alphaPointer++;
    return path.join(benchDir, i + '.js');
  });
}

function resultPaths(files, dir, result) {
  return files.map(function(fullPath) {
    return fullPath.replace(path.sep + dir + path.sep, path.sep + result + path.sep);
  });
}

function seedResultDirectories(paths) {
  paths.forEach(function(fullPath) {
    mkdirp(path.dirname(fullPath));
  });
}

function makeFiles(paths, resultPath) {
  paths.filter(function(fullPath) {
    return !exists(fullPath);
  }).forEach(function(fullPath) {
    mkdirp(path.dirname(fullPath));
    fs.writeFileSync(fullPath);
  });
}
