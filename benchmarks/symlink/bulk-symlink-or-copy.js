var bulkSymlinkOrCopy = require('../../index').sync;

function fn(setupOptions) {
  bulkSymlinkOrCopy(setupOptions.fileMapping);
}

module.exports.fn = fn;
module.exports.name = 'bulk-symlink-or-copy';
