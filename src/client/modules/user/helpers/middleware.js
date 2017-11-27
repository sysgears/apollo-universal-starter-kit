import LocalStorage from './LocalStorage';

const tokenMiddleware = async (req, options, next) => {
  options.headers['x-token'] = await LocalStorage.getItem('token');
  options.headers['x-refresh-token'] = await LocalStorage.getItem('refreshToken');
  next();
};

const tokenAfterware = async (res, options, next) => {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    await LocalStorage.setItem('token', token);
  }
  if (refreshToken) {
    await LocalStorage.setItem('refreshToken', refreshToken);
  }
  next();
};

const connectionParam = async () => {
  return {
    token: await LocalStorage.getItem('token'),
    refreshToken: await LocalStorage.getItem('refreshToken')
  };
};

export { tokenMiddleware, tokenAfterware, connectionParam };
