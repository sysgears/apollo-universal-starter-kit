import Expo from 'expo';

export default class {
  static async getItem(key) {
    return Expo.SecureStore.getItemAsync(key);
  }

  static async setItem(key, value) {
    return Expo.SecureStore.setItemAsync(key, value);
  }
}
