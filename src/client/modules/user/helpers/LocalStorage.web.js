export default class {
  static async getItem(key) {
    return window.localStorage.getItem(key);
  }

  static async setItem(key, value) {
    window.localStorage.setItem(key, value);
  }
}
