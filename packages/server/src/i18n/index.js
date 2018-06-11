import i18n from 'i18n';

export default function i18Init() {
  i18n.configure({
    locales: ['en', 'ru'],
    directory: process.cwd() + '/src/i18n/locales',
    cookie: 'locale'
  });

  return i18n.init;
}
