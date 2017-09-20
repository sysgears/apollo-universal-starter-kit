import { ApplicationRef, NgModule}  from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { removeNgStyles, createNewHosts, bootloader, createInputTransfer, hmrModule } from '@angularclass/hmr';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
// Virtual module that changes when any change to backend is detected
import "backend_reload";

import Main from "./app/Main";
import log from "../common/log";

@NgModule({
  bootstrap: [ Main ],
  declarations: [ Main ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([], {
      useHash: true
    }),
  ],
  providers: []
})
class MainModule {
  constructor(public appRef: ApplicationRef) {}

  hmrOnInit(store: any) {
    if (!store || !store.state) return;
    log.debug("Updating front-end", store.state.data);
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: any) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = {data: 'yolo'};
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: any) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
}

export function main() {
  const result = platformBrowserDynamic().bootstrapModule(MainModule);
  if (__DEV__) {
    result.then((ngModuleRef: any) => {
      return hmrModule(ngModuleRef, module);
    });
  }
}

if (__DEV__) {
  if (module.hot) {
    module.hot.accept("backend_reload", () => {
      log.debug("Reloading front-end");
      window.location.reload();
    });
  }
}

// boot on document ready
bootloader(main);
