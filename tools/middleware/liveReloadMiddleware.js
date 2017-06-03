/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * Updated by Victor Vlasenko (SysGears INC) to prevent memory leaks and slow down,
 * due to new compiler plugin registration on each HTTP request
 */

/**
 * Live reload middleware
 */
function liveReloadMiddleware(compiler) {
  let watchers = [];

  /**
   * On new `build`, notify all registered watchers to reload
   */
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
    /**
     * React Native client opens connection at `/onchange`
     * and awaits reload signal (http status code - 205)
     */
    if (req.path === '/onchange') {
      const watcher = { req, res };

      watchers.push(watcher);

      req.on('close', () => {
        watchers.splice(watchers.indexOf(watcher), 1);
      });

      return;
    }

    next();
  };
}

module.exports = liveReloadMiddleware;
