var _setup = require('./symlink/_setup');

function log(message) {
  console.log(message);
}

module.exports = function(run) {
  var setupOptions = _setup('symlink', 'result', run.fileCount);
  run.suites.forEach(function(s) {
    log(' - ' + s.name);
    var start = process.hrtime();

    setupOptions.before();
    for (var i = 0; i < run.count; i++) {
      setupOptions.each(s.seed);
      s.fn(setupOptions);
    }

    var end = process.hrtime(start);
    setupOptions.after();
    console.info("Execution time: %ds %dms", end[0], end[1]/1000000);
  });
};
