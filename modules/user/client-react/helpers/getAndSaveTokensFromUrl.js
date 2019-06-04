import { setItem } from '@gqlapp/core-common/clientStorage';

const getAndSaveTokensFromUrl = async url => {
  // Checks exists data in url
  const dataRegExp = /data=([^#]+)/;
  if (!url.match(dataRegExp)) return;

  // Extract stringified user string out of the URL
  const [, data] = url.match(dataRegExp);
  const decodedData = JSON.parse(decodeURI(data));

  if (decodedData.tokens) {
    await setItem('accessToken', decodedData.tokens.accessToken);
    await setItem('refreshToken', decodedData.tokens.refreshToken);
  }
};

export default getAndSaveTokensFromUrl;
