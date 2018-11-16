import * as Expo from 'expo';

const LanguageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async (callback: (lang: string) => string) => {
    const lng = await Expo.SecureStore.getItemAsync('i18nextLng');
    return callback(lng || (await (Expo as any).Localization.getLocalizationAsync()).locale.replace('_', '-'));
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    Expo.SecureStore.setItemAsync('i18nextLng', lng);
  }
};

export default LanguageDetector;
