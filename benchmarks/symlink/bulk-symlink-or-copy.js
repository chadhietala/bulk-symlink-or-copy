var bulkSymlinkOrCopy = require('../../index');

function fn(setupOptions) {
  bulkSymlinkOrCopy(setupOptions.fileMapping);
}

module.exports.fn = fn;
module.exports.name = 'bulk-symlink-or-copy';
