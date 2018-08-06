import url from 'url';

export const serverPort = process.env.PORT || __SERVER_PORT__;
export const isApiExternal = !!url.parse(__API_URL__).protocol;
export const internalHost = 'localhost';
export const apiUrl = !isApiExternal ? `http://${internalHost}:${serverPort}${__API_URL__}` : __API_URL__;
