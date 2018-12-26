import path from 'path';
import fs from 'fs';
import { isApiExternal, log } from '@module/core-common';

let assetMap: { [key: string]: string };

/**
 * Gets rid of circular data in the object,
 * replaces circular links to '[Circular]' string
 * It is needed for converting the Error object into JSON via JSON.stringify
 */
const stripCircular = (circularData: any, seen: any[] | null) => {
  const notCircularData = Array.isArray(circularData) ? [] : {};
  seen = seen || [];
  seen.push(circularData);

  Object.getOwnPropertyNames(circularData).forEach(key => {
    if (!circularData[key] || (typeof circularData[key] !== 'object' && !Array.isArray(circularData[key]))) {
      notCircularData[key] = circularData[key];
    } else if (seen.indexOf(circularData[key]) < 0) {
      notCircularData[key] = stripCircular(circularData[key], seen.slice(0));
    } else {
      notCircularData[key] = '[Circular]';
    }
  });

  return notCircularData;
};

/**
 * The code below MUST be declared as a function, not closure,
 * otherwise Express will fail to execute this handler
 *
 * Important: should have 4 params, even if they are not used
 */
function errorMiddleware(e: Error, req: any, res: any, next: () => void) {
  if (!isApiExternal && req.path === __API_URL__) {
    const stack = e.stack.toString().replace(/[\n]/g, '\\n');
    res.status(200).send(`[{"data": {}, "errors":[{"message": "${stack}"}]}]`);
  } else {
    log.error(e);

    if (__DEV__ || !assetMap) {
      assetMap = JSON.parse(fs.readFileSync(path.join(__FRONTEND_BUILD_DIR__, 'assets.json')).toString());
    }

    res.status(200).send(
      `<html>
            <script charset="UTF-8">window.__SERVER_ERROR__=${JSON.stringify(stripCircular(e, null))};</script>
            <body>
                 <div id="root"></div>
                 ${assetMap['vendor.js'] ? `<script src="${assetMap['vendor.js']}" charSet="utf-8"></script>` : ''}
                 <script src="${assetMap['index.js']}" charSet="utf-8"></script>
          </body>
       </html>`
    );
  }
}

export default errorMiddleware;
