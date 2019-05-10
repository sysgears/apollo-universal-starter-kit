require('dotenv/config');
require('@babel/register')({ cwd: __dirname + '/../..', extensions: ['.js', '.ts'] });

module.exports = require('@gqlapp/database-server-ts/knexdata');
