import url from 'url';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);

export default function urlHandler(expoUrl, authType) {
  let serverPort = process.env.PORT || port;
  const expoHostname = `${url.parse(expoUrl).hostname}.nip.io`;
  const urlHostname = process.env.NODE_ENV === 'production' ? hostname : expoHostname;

  return `${protocol}//${urlHostname}${
    serverPort ? `:${serverPort}` : ''
  }/auth/${authType}?expoUrl=${encodeURIComponent(expoUrl)}`;
}

export function urlHandlerWeb(authType) {
  let serverPort = process.env.PORT || port;
  if (__DEV__) {
    serverPort = '3000';
  }

  return `${protocol}//${hostname}${serverPort ? `:${serverPort}` : ''}/auth/${authType}`;
}
