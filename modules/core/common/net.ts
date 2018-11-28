import url from 'url';

export const serverPort = __SERVER__ && (process.env.PORT || __SERVER_PORT__);
export const isApiExternal = !!url.parse(__API_URL__).protocol;

const clientApiUrl = !isApiExternal
  ? `${window.location.protocol}//${window.location.hostname}${
      __DEV__ ? ':8080' : window.location.port ? ':' + window.location.port : ''
    }${__API_URL__}`
  : __API_URL__;

const serverApiUrl = !isApiExternal ? `http://localhost:${serverPort}${__API_URL__}` : __API_URL__;

export const apiUrl = __SERVER__ ? serverApiUrl : clientApiUrl;
