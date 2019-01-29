import { jwt, session } from './modules';
import serial from './serial';

import AccessModule from './AccessModule';

// Try to grant access via sessions first, and if that fails, then try using JWT
// This way if both JWT and sessions enabled UI won't have to refresh access tokens
export default new AccessModule(serial, session, jwt);
