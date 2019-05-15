import url from 'url';
import { Constants } from 'expo';
import { setItem } from '@gqlapp/core-common/clientStorage';
import settings from '@gqlapp/config';

export const buildRedirectUrlForMobile = authType => {
  const { protocol, hostname, port } = url.parse(__WEBSITE_URL__);
  const expoHostname = `${url.parse(Constants.linkingUrl).hostname}.nip.io`;
  const urlHostname = process.env.NODE_ENV === 'production' ? hostname : expoHostname;

  return `${protocol}//${urlHostname}${port ? ':' + port : ''}/auth/${authType}?expoUrl=${encodeURIComponent(
    Constants.linkingUrl
  )}`;
};

export const defineLoginWay = (socialNetwork, login, expoLogin) => {
  const {
    auth: {
      social: {
        [socialNetwork]: { enabled: isLogin },
        [`${socialNetwork}Expo`]: { enabled: isExpoLogin }
      }
    }
  } = settings;

  if ((isLogin && isExpoLogin) || isLogin) {
    return () => login();
  } else {
    return client => expoLogin(client);
  }
};

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await setItem('accessToken', accessToken);
  await setItem('refreshToken', refreshToken);
};
