import url from 'url';

export default function buildRedirectUrlForWeb(authType) {
  const { protocol, hostname, port } = url.parse(__API_URL__);
  let serverPort = process.env.PORT || port;
  if (__DEV__) {
    serverPort = '3000';
  }

  return `${protocol}//${hostname}${serverPort ? `:${serverPort}` : ''}/auth/${authType}`;
}
