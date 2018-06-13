const clientI18n = {
  langPickerRender: true,
  langList: ['en-US', 'ru-RU'],
  fallbackLng: 'en-US'
};

const serverI18n = {
  locales: ['en', 'ru'],
  directory: process.cwd() + '/src/modules/i18n/locales',
  cookie: 'locale'
};

export { clientI18n, serverI18n };
