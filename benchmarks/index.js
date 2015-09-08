require('./runner')(
  {
    count: 1000,
    fileCount: 100,
    name: 'symlink',
    suites: [
      require('./symlink/bulk-symlink-or-copy'),
      require('./symlink/symlink-or-copy')
    ]
  }
);
