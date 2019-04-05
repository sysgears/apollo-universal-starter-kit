import url from 'url';
import { Constants } from 'expo';
import { Platform } from 'react-native';

export default function buildRedirectUrlForMobile(authType) {
  const { protocol, hostname, port } = url.parse(__WEBSITE_URL__);
  const expoHostname = Platform.OS === 'android' ? 'localhost' : `${url.parse(Constants.linkingUrl).hostname}.nip.io`;
  const urlHostname = process.env.NODE_ENV === 'production' ? hostname : expoHostname;

  return `${protocol}//${urlHostname}${port ? ':' + port : ''}/auth/${authType}?expoUrl=${encodeURIComponent(
    Constants.linkingUrl
  )}`;
}
