import { AuthModule } from '@module/authentication-server-ts/social';
import facebook, { facebookData } from './facebook';
import github, { githubData } from './github';
import google, { googleData } from './google';
import linkedin, { linkedinData } from './linkedIn';
import password from './password';

const social = {
  ...linkedinData,
  ...facebookData,
  ...googleData,
  ...githubData
};

export default new AuthModule(facebook, github, google, linkedin, password, {
  data: { social }
});
