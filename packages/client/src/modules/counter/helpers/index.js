import clientCounterLocalization from '../clientCounter/locales';
import reduxCounterLocalization from '../reduxCounter/locales';
import serverCounterLocalization from '../serverCounter/locales';
import counterLocalization from '../locales';

const mergeLocalization = () => {
  const localization = {};
  for (const lang of Object.keys(counterLocalization)) {
    localization[lang] = {
      ...counterLocalization[lang],
      ...clientCounterLocalization[lang],
      ...reduxCounterLocalization[lang],
      ...serverCounterLocalization[lang]
    };
  }
  return localization;
};

export { mergeLocalization as default };
