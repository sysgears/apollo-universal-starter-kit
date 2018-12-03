import url from 'url';
import { PLATFORM } from './utils';

export const serverPort = PLATFORM === 'server' && (process.env.PORT || __SERVER_PORT__);
export const isApiExternal = !!url.parse(__API_URL__).protocol;

const clientApiUrl =
  !isApiExternal && PLATFORM !== 'server'
    ? `${window.location.protocol}//${window.location.hostname}${
        __DEV__ ? ':8080' : window.location.port ? ':' + window.location.port : ''
      }${__API_URL__}`
    : __API_URL__;

const serverApiUrl = !isApiExternal ? `http://localhost:${serverPort}${__API_URL__}` : __API_URL__;

export const apiUrl = PLATFORM === 'server' ? serverApiUrl : clientApiUrl;
