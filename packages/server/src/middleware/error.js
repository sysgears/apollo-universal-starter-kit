import path from 'path';
import fs from 'fs';

import { isApiExternal } from '../net';
import log from '../../../common/log';

let assetMap;

const stripCircular = (from, seen) => {
  const to = Array.isArray(from) ? [] : {};
  seen = seen || [];
  seen.push(from);
  Object.getOwnPropertyNames(from).forEach(key => {
    if (!from[key] || (typeof from[key] !== 'object' && !Array.isArray(from[key]))) {
      to[key] = from[key];
    } else if (seen.indexOf(from[key]) < 0) {
      to[key] = stripCircular(from[key], seen.slice(0));
    } else to[key] = '[Circular]';
  });
  return to;
};

/*
 * The code below MUST be declared as a function, not closure,
 * otherwise Express will fail to execute this handler
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(e, req, res, next) {
  if (!isApiExternal && req.path === __API_URL__) {
    const stack = e.stack.toString().replace(/[\n]/g, '\\n');
    res.status(200).send(`[{"data": {}, "errors":[{"message": "${stack}"}]}]`);
  } else {
    log.error(e);

    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')));
    }

    const serverErrorScript = `<script charset="UTF-8">window.__SERVER_ERROR__=${JSON.stringify(
      stripCircular(e)
    )};</script>`;
    const vendorScript = assetMap['vendor.js']
      ? `<script src="/${assetMap['vendor.js']}" charSet="utf-8"></script>`
      : '';

    res.status(200).send(
      `<html>${serverErrorScript}<body><div id="root"></div>
      ${vendorScript}
          <script src="/${assetMap['index.js']}" charSet="utf-8"></script>
          </body></html>`
    );
  }
}

export default errorMiddleware;
