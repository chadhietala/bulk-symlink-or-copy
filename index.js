
var fs = require('fs');
var path = require('path');
var cache = {};

function unique(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  return Object.keys(obj);
}

module.exports = function() {
  throw TypeError('only sync is currrently implemented');
};

module.exports = function(paths) {
  var count = 0;
  var cache = {};
  var map = {};
  var linked = {};

  paths.map(function(paths) {
    return Object.keys(paths)[0];
  }).forEach(function(srcPath, i) {

    var lstat = fs.lstatSync(srcPath);

    if (lstat.isSymbolicLink()) {
      srcPath.split('/').reduce(function(current, next) {
        if (current) {
          current = current + '/' + next;
        } else {
          current = '/' + next;
        }

        if (!current)        { return; }
        if (current === '.') { return; }
        if (current === '')  { return; }
        if (current === '/') { return; }

        if (!cache[current]) {
          fs.realpathSync(current, cache);
        }

        return current;
      }, '');
    } else if (srcPath[0] !== '/') {
      srcPath = process.cwd() + '/' + srcPath;
    }

    if (!linked[srcPath]) {
      fs.symlinkSync(srcPath, paths[i][srcPath]);
      linked[srcPath] = true;
    }
  });
};
