import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader, createInputTransfer, createNewHosts, hmrModule, removeNgStyles } from '@angularclass/hmr';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';
import { StoreModule, Store } from '@ngrx/store';
import { apiUrl } from '@gqlapp/core-common';
import ClientModule from '@gqlapp/module-client-angular';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

import createApolloClient from '../../../packages/common/createApolloClient';
import { MainComponent, metaReducers } from './Main';
import log from '../../../packages/common/log';

const createApp = (modules: ClientModule) => {
  const client = createApolloClient({
    apiUrl,
    createNetLink: modules.createNetLink,
    createLink: modules.createLink,
    connectionParams: modules.connectionParams,
    clientResolvers: modules.resolvers
  });

  @NgModule({
    declarations: [MainComponent],
    bootstrap: [MainComponent],
    imports: [
      BrowserModule,
      HttpClientModule,
      ApolloModule,
      HttpLinkModule,
      RouterModule.forRoot(modules.routes),
      StoreModule.forRoot(modules.reducers, { metaReducers }),
      ...modules.modules
    ],
    providers: []
  })
  class MainModule {
    constructor(public appRef: ApplicationRef, apollo: Apollo, private appStore: Store<any>) {
      apollo.setClient(client);
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
      store.disposeOldHosts = createNewHosts(this.appRef.components.map(cmp => cmp.location.nativeElement));
      this.appStore.pipe(take(1)).subscribe(state => (store.state = state));
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

  function main() {
    const result = platformBrowserDynamic().bootstrapModule(MainModule);
    if (__DEV__) {
      result.then((ngModuleRef: any) => {
        return hmrModule(ngModuleRef, module);
      });
    }
  }

  // boot on document ready
  bootloader(main);
};

if (__DEV__ && module.hot) {
  module.hot.accept('backend_reload', () => {
    log.debug('Reloading front-end');
    window.location.reload();
  });
}

export default new ClientModule({
  onAppCreate: [createApp]
});
