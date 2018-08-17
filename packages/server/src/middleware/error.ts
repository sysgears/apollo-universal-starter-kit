import path from 'path';
import fs from 'fs';

import { isApiExternal } from '../net';
import log from '../../../common/log';

let assetMap: { [key: string]: string };

/**
 * Gets rid of circular data in the object,
 * replaces circular links to '[Circular]' string
 * It is needed for converting the Error object into JSON via JSON.stringify
 */
const stripCircular = (cilcularData: any, seen: any[] | null) => {
  const notCilcularData = Array.isArray(cilcularData) ? [] : {};
  seen = seen || [];
  seen.push(cilcularData);

  Object.getOwnPropertyNames(cilcularData).forEach(key => {
    if (!cilcularData[key] || (typeof cilcularData[key] !== 'object' && !Array.isArray(cilcularData[key]))) {
      notCilcularData[key] = cilcularData[key];
    } else if (seen.indexOf(cilcularData[key]) < 0) {
      notCilcularData[key] = stripCircular(cilcularData[key], seen.slice(0));
    } else {
      notCilcularData[key] = '[Circular]';
    }
  });

  return notCilcularData;
};

/**
 * The code below MUST be declared as a function, not closure,
 * otherwise Express will fail to execute this handler
 *
 * Important: should have 4 params, even if they don't used
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
