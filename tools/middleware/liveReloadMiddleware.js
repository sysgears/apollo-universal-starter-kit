function liveReloadMiddleware(compiler) {
  let watchers = [];

  compiler.plugin('done', () => {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };

    watchers.forEach(watcher => {
      watcher.res.writeHead(205, headers);
      watcher.res.end(JSON.stringify({ changed: true }));
    });

    watchers = [];
  });

  return (req, res, next) => {
    if (req.path === '/onchange') {
      const watcher = { req, res };

      watchers.push(watcher);

      req.on('close', () => {
        for (let i = 0; i < watchers.length; i++) {
          if (watchers[i] && watchers[i].req === req) {
            watchers.splice(i, 1);
            break;
          }
        }
      });
    } else {
      next();
    }
  };
}

module.exports = liveReloadMiddleware;
