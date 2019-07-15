import url from 'url';
import { PLATFORM } from './utils';

const apiUrlDefine = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '/graphql';

export const serverPort =
  PLATFORM === 'server' && (process.env.PORT || (typeof __SERVER_PORT__ !== 'undefined' ? __SERVER_PORT__ : 8080));
export const isApiExternal = !!url.parse(apiUrlDefine).protocol;

const clientApiUrl =
  !isApiExternal && PLATFORM === 'web'
    ? `${window.location.protocol}//${window.location.hostname}${
        __DEV__ ? ':8080' : window.location.port ? ':' + window.location.port : ''
      }${apiUrlDefine}`
    : apiUrlDefine;

const serverApiUrl = !isApiExternal ? `http://localhost:${serverPort}${apiUrlDefine}` : apiUrlDefine;

export const apiUrl = PLATFORM === 'server' ? serverApiUrl : clientApiUrl;
