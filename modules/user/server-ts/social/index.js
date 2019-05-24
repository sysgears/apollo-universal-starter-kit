import { AuthModule } from '@gqlapp/authentication-server-ts';
import facebook, { facebookData } from './facebook';
import github, { githubData } from './github';
import google, { googleData } from './google';
import linkedin, { linkedinData } from './linkedIn';
import facebookNative from './facebookNative';
import googleExpo from './googleExpo';

const social = {
  ...linkedinData,
  ...facebookData,
  ...googleData,
  ...githubData
};

export default new AuthModule(facebook, github, google, linkedin, facebookNative, googleExpo, {
  appContext: { social }
});
