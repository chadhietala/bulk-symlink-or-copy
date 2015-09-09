var symlinkOrCopy = require('symlink-or-copy').sync;
var path = require('path');

function fn(setupOptions) {
  setupOptions.files.forEach(function(fullPath, i) {
    path.dirname(setupOptions.resultFiles[i]);
    symlinkOrCopy(fullPath, setupOptions.resultFiles[i]);
  });
}

module.exports.fn = fn;
module.exports.name = 'symlink-or-copy';
module.exports.seed = true;
