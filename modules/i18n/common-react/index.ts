import i18next, { i18n as I18N, Resource } from 'i18next';

import CommonModule from '@gqlapp/module-common';
import settings from '@gqlapp/config';

import './init';

/**
 * Adds resources into the i18next bundle
 *
 * @param i18n - i18next
 * @param resources - The resources to add
 */
const addResourcesI18n = (i18n: I18N, resources: Array<{ ns: string; resources: Resource }>) => {
  for (const localization of resources) {
    for (const lang of Object.keys(localization.resources)) {
      const resource = (i18n.options.whitelist as string[]).filter((lng: string) => lng.includes(lang));
      if (resource.length) {
        i18n.addResourceBundle(resource[0], localization.ns, localization.resources[lang]);
      }
    }
  }
};

export default (settings.i18n.enabled &&
  new CommonModule({
    onAppCreate: [async (modules: CommonModule) => addResourcesI18n(i18next, modules.localizations)]
  })) ||
  undefined;
