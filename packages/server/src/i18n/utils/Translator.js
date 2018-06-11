import i18n from 'i18n';

export default class Translator {
  static translate(cookie, moduleName, messageKey) {
    const langInCookie = cookie.match(/lang=(.*)-/);
    let clientLanguage;

    if (langInCookie) {
      clientLanguage = langInCookie[1];
    } else {
      clientLanguage = i18n.getLocale();
    }
    console.log('CATALOG!', i18n.getCatalog(clientLanguage));
    const translation = i18n.getCatalog(clientLanguage)[moduleName][messageKey];
    if (!translation) {
      throw new Error(
        `Translation by messageKey: ${messageKey} for the module: ${moduleName} has not been found! Please, add it.`
      );
    }

    return translation;
  }
}
