/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * MIT License
 *
 * Copyright (c) 2017 Mike Grabowski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
