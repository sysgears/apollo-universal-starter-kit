import url from 'url';
import { Constants } from 'expo';

export default function buildRedirectUrlForMobile(authType) {
  const { protocol, hostname, port } = url.parse(__API_URL__);
  let serverPort = process.env.PORT || port;
  const expoHostname = `${url.parse(Constants.linkingUrl).hostname}.nip.io`;
  const urlHostname = process.env.NODE_ENV === 'production' ? hostname : expoHostname;

  return `${protocol}//${urlHostname}${
    serverPort ? `:${serverPort}` : ''
  }/auth/${authType}?expoUrl=${encodeURIComponent(Constants.linkingUrl)}`;
}
