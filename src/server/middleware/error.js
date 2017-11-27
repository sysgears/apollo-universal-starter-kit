import path from 'path';
import fs from 'fs';
import log from '../../common/log';
import { options as spinConfig } from '../../../.spinrc.json';

let assetMap;

/* 
 * The code below MUST be declared as a function, not closure, 
 * otherwise Express will fail to execute this handler
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(e, req, res, next) {
  log.error(e);
  if (__DEV__ || !assetMap) {
    assetMap = JSON.parse(fs.readFileSync(path.join(spinConfig.frontendBuildDir, 'web', 'assets.json')));
  }

  const serverErrorScript = `<script charset="UTF-8">window.__SERVER_ERROR__=${JSON.stringify(
    e,
    Object.getOwnPropertyNames(e)
  )};</script>`;
  const vendorScript = assetMap['vendor.js'] ? `<script src="/${assetMap['vendor.js']}" charSet="utf-8"></script>` : '';

  res.status(200).send(
    `<html>${serverErrorScript}<body><div id="content"></div>
    ${vendorScript}
        <script src="/${assetMap['index.js']}" charSet="utf-8"></script>
        </body></html>`
  );
}

export default errorMiddleware;
