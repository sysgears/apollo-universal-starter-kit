function liveReloadMiddleware(compiler) {
  let watchers = [];

  compiler.plugin('done', () => {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };

    watchers.forEach(watcher => {
      watcher.writeHead(205, headers);
      watcher.end(JSON.stringify({ changed: true }));
    });

    watchers = [];
  });

  return (req, res, next) => {
    if (req.path === '/onchange') {
      const watcher = res;

      watchers.push(watcher);

      req.on('close', () => {
        watchers.splice(watchers.indexOf(watcher), 1);
      });
    } else {
      next();
    }
  };
}

module.exports = liveReloadMiddleware;
