import Facebook from './providers/facebook';
import Google from './providers/google';

import settings from '../../../../../settings';

const OAuthMap = {
  facebook: Facebook,
  google: Google
};

const Enable = app => {
  for (let provider in settings.auth.oauth.providers) {
    if (provider.enabled === true) {
      let P = OAuthMap[provider];
      P.Enable();
      P.AddRoutes(app);
    }
  }
};

const AddRoutes = app => {
  for (let provider in settings.auth.oauth.providers) {
    if (provider.enabled === true) {
      let P = OAuthMap[provider];
      P.AddRoutes(app);
    }
  }
};

export default {
  Enable,
  AddRoutes
};
