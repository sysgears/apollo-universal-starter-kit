import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';

const LanguageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async (callback: (lang: string) => string) => {
    const lng = await SecureStore.getItemAsync('i18nextLng');
    return callback(lng || (await Localization.getLocalizationAsync()).locale.replace('_', '-'));
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    SecureStore.setItemAsync('i18nextLng', lng);
  }
};

export default LanguageDetector;
