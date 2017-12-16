import Facebook from './providers/facebook';
import Google from './providers/google';

import settings from '../../../../../settings';

const OAuthMap = {
  facebook: Facebook,
  google: Google
};

const oauth = settings.auth.authentication.oauth;

const Enable = app => {
  for (let provider in oauth.providers) {
    let prvdr = oauth.providers[provider];
    let P = OAuthMap[provider];
    if (prvdr.enabled) {
      P.Enable();
      P.AddRoutes(app);
    }
  }
};

export default {
  Enable
};
