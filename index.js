
var fs = require('fs');
var path = require('path');
var commondir = require('commondir');

function commonBase(srcDirs, destDirs, cache) {
  var statedDirs = Object.keys(cache);
  var contained = false;
  var commonSrc = commondir(srcDirs);
  var commonDest = commondir(destDirs);

  if (cache[commonSrc]) {
    contained = true;
  }

  return { contained: contained, srcDir: commondir(srcDirs), destDir: commondir(destDirs) };
}

function isRelativePaths(paths) {
  return paths.every(function(path) {
    return path[0] !== '/';
  });
}

module.exports = function() {
  throw TypeError('only sync is currrently implemented');
};

module.exports.sync = function(paths) {
  if (paths.length < 1) {
    return;
  }

  var cache = {};
  var srcDirs = paths.map(function(paths) {
    return path.dirname(Object.keys(paths)[0]);
  });

  var destDirs = paths.map(function(paths) {
    return path.dirname(paths[Object.keys(paths)[0]]);
  });

  var srcIsRelative = isRelativePaths(srcDirs);
  var destIsRelative = isRelativePaths(destDirs);

  if (srcIsRelative && destIsRelative) {
    srcDirs = srcDirs.map(function(srcDir) {
      return path.join(process.cwd(), srcDir);
    });
    destDirs = destDirs.map(function(destDir) {
      return path.join(process.cwd(), destDir);
    });
  } if (srcIsRelative !== destIsRelative) {
    throw new Error('Mixed relative and absoulte paths encountered.');
  }

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

  var base = commonBase(srcDirs, destDirs, cache);

  if (base.contained) {
    fs.symlinkSync(base.srcDir, base.destDir);
  } else {
    throw new Error('No common base encountered');
  }
};
