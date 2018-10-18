import url from 'url';

export const serverPort = process.env.PORT || __SERVER_PORT__;
export const isApiExternal = !!url.parse(__API_URL__).protocol;
export const apiUrl = !isApiExternal ? `http://localhost:${serverPort}${__API_URL__}` : __API_URL__;
