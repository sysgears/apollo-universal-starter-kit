import 'zone.js/dist/zone';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';

import { AppBrowserModuleNgFactory } from './app/app.browser.module.ngfactory';

export function main(): any {
  return platformBrowserDynamic().bootstrapModuleFactory(AppBrowserModuleNgFactory);
}

enableProdMode();
bootloader(main);
