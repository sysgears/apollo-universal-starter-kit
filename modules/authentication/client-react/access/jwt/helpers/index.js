import { setItem, removeItem } from '@gqlapp/core-common/clientStorage';

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await setItem('accessToken', accessToken);
  await setItem('refreshToken', refreshToken);
};

export const removeTokens = async () => {
  await removeItem('accessToken');
  await removeItem('refreshToken');
};
