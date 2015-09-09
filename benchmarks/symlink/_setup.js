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
  var fileMapping = files.map(function(file, i) {
    var mapping = {};
    mapping[file] = resultFiles[i];
    return mapping;
  });

  mkdirp(results);

  return {
    resultFiles: resultFiles,
    resultPath: results,
    files: files,
    fileMapping: fileMapping,
    each: function() {
      rm(results);
      seedResultDirectories(resultFiles);
    },

    before: function() {
      mkdirp(fullPath);
      makeFiles(files);
      seedResultDirectories(resultFiles);
    },

    after: function() {
      rm(results);
      rm(fullPath);
    }
  };
};

function alphabet() {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
}

function makePaths(fullPath, count) {
  var alphaPointer = 0;
  var benchDir;
  var benchFile;
  count = count || 4000;
  var alpha = alphabet();
  var dirCount = 0;

  return Array.apply(null, Array(count)).map(function(_, i) {
    var dir = 'bench';

    if (i % 26 === 0) {
      alphaPointer = 0;
      dirCount = 0;
    }

    if (i % 7 === 0) {
      dir = alpha[dirCount];
      dirCount++;
    }

    alphaPointer++;
    return path.join(fullPath, dir, alpha[alphaPointer] + process.hrtime()[1] + '.js');
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
