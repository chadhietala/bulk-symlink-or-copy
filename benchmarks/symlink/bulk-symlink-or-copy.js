var bulkSymlinkOrCopy = require('../../index');

function fn(setupOptions) {
  bulkSymlinkOrCopy(setupOptions.files, setupOptions.resultPath);
}

module.exports.fn = fn;
module.exports.name = 'bulk-symlink-or-copy';
