
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

  paths.map(function(paths) {
    return Object.keys(paths)[0];
  }).forEach(function(srcPath) {

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

    if (cache[srcPath]) {
      fs.symlinkSync(srcPath, paths[srcPath]);
    }
  });

  // paths.forEach(function(paths) {
  //   var src = Object.keys(paths)[0];
  //   var srcDir = path.dirname(src);
  //   fs.symlinkSync(src, paths[src]);
  // });



  // paths.forEach(function(paths) {
  //   var src = Object.keys(paths)[0];
  //   var srcDir = path.dirname(src);
  //   var dest = paths[src];
  //
  //   srcDir.split('/').reduce(function(current, next) {
  //     if (current) {
  //       current = current + '/' + next;
  //     } else {
  //       current = '/' + next;
  //     }
  //
  //     if (!current)        { return; }
  //     if (current === '.') { return; }
  //     if (current === '')  { return; }
  //     if (current === '/') { return; }
  //
  //     if (!created[current]) {
  //       try {
  //         count++;
  //         fs.realpathSync(current, created);
  //       } catch(e) {
  //         if (e.code !== 'EEXIST') {
  //           throw e;
  //         }
  //       }
  //     }
  //
  //     return current;
  //
  //   }, '');
  // });

  // paths.forEach(function(paths) {
  //   var src = Object.keys(paths)[0];
  //   var srcDir = path.dirname(src);
  //   fs.symlinkSync(src, paths[src]);
  // });

  // console.log(count, paths.length, f.length, unique(paths.map(function(item) {
  //   return Object.keys(item)[0];
  // })).length);
  // for each tople

  // for (var i = 0, l = paths.length; i < l; i++) {
  //   var path = paths[i];
  //   var srcPath = fs.realpathSync(path, cache);
  //   cache[path] = srcPath;
  //   fs.symlinkSync(srcPath, destinations[i]);
  // }
};
