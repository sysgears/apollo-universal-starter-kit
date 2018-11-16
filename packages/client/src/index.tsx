import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader, createInputTransfer, createNewHosts, hmrModule, removeNgStyles } from '@angularclass/hmr';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import { client, MainComponent } from './app/Main';
import { CounterModule } from './modules/counter';
import routes from './app/Routes';
import log from '../../common/log';
import modules from './modules';
import { reducers, metaReducers } from '../../common/createReduxStore';
import { StoreModule, Store } from '@ngrx/store';

@NgModule({
  declarations: [MainComponent],
  bootstrap: [MainComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, { metaReducers }),
    CounterModule,
    ...modules.modules
  ],
  providers: []
})
class MainModule {
  constructor(public appRef: ApplicationRef, apollo: Apollo, private appStore: Store<any>) {
    apollo.create(client);
  }

  public hmrOnInit(store: any) {
    if (!store || !store.state) {
      return;
    }
    this.appStore.dispatch({ type: 'SET_ROOT_STATE', payload: store.state });
    log.debug('Updating front-end', store.state.data);
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

  public hmrOnDestroy(store: any) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    store.disposeOldHosts = createNewHosts(cmpLocation);
    let currentStore: any;
    this.appStore.pipe(take(1)).subscribe(state => (currentStore = state));
    store.state = { ...currentStore };
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: any) {
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
    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end');
      window.location.reload();
    });
  }
}

// boot on document ready
bootloader(main);
