import jwt from 'jsonwebtoken';

import { User } from '@gqlapp/user-server-ts';

import settings from '../../../../../settings';
import createTokens from './createTokens';

const getHash = async id => (await User.getUserWithPassword(id)).passwordHash || '';

const refreshToken = async ({ body: { refreshToken: inputRefreshToken } }, res) => {
  const {
    locals: { t }
  } = res;
  const decodedToken = jwt.decode(inputRefreshToken);
  const isValidToken = decodedToken && decodedToken.id;

  if (!isValidToken) {
    res.status(401).json(t('auth:invalidRefresh'));
  }

  const identity = await User.getUser(decodedToken.id);
  const hash = await getHash(decodedToken.id);
  const refreshSecret = settings.auth.secret + hash;

  try {
    jwt.verify(inputRefreshToken, refreshSecret);
  } catch (e) {
    res.status(401).json(e);
  }

  const [accessToken, refreshToken] = await createTokens(identity, settings.auth.secret, refreshSecret);

  res.json({ accessToken, refreshToken });
};

const restApi = [{ route: '/refreshToken', controller: refreshToken, method: 'POST' }];

export default restApi;
