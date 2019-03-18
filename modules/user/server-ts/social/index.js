import { AuthModule } from '@gqlapp/authentication-server-ts';
import facebook, { facebookData } from './facebook';
import github, { githubData } from './github';
import google, { googleData } from './google';
import linkedin, { linkedinData } from './linkedIn';

const social = {
  ...linkedinData,
  ...facebookData,
  ...googleData,
  ...githubData
};

export default new AuthModule(facebook, github, google, linkedin, {
  appContext: { social }
});
