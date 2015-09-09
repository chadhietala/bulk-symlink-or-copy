
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

function contains(mainPath, subPath) {
  if (mainPath === subPath) {
    return true;
  }
  mainPath = path.resolve(mainPath);
  subPath = path.resolve(subPath);
  return subPath.indexOf(mainPath) === 0 && subPath.slice(mainPath.length)[0] === '/';
}

function commonBase(srcDirs, destDirs) {
  var srcsSorted = unique(srcDirs).sort(function(a, b) {
    return a.length > b.length;
  });

  var destsSorted = unique(destDirs).sort(function(a, b) {
    return a.length > b.length;
  });

  var contained = srcsSorted.every(function(item, i) {
    return contains(srcsSorted[0], item) && contains(destsSorted[0], destsSorted[i]);
  });

  return { contained: contained, srcDir: srcsSorted[0], destDir: destsSorted[0] };
}

module.exports = function() {
  throw TypeError('only sync is currrently implemented');
};

module.exports = function(paths) {
  var count = 0;
  var cache = {};
  var map = {};
  var linked = {};
  var srcDirs = paths.map(function(paths) {
    return path.dirname(Object.keys(paths)[0]);
  });

  var destDirs = paths.map(function(paths) {
    return path.dirname(paths[Object.keys(paths)[0]]);
  });

  srcDirs.forEach(function(srcDir, i) {
    srcDir.split('/').reduce(function(current, next) {
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
  });

  var base = commonBase(srcDirs, destDirs);
  if (base.contained) {
    fs.symlinkSync(base.srcDir, base.destDir);
  } else {
    unique(srcDirs).forEach(function(srcPath, i) {
      try {
        fs.symlinkSync(srcPath, path.dirname(paths[srcPath]));
      } catch (e) {
        if (e.code !== 'EEXIST') {
          throw e;
        }
      }
    });
  }
};
