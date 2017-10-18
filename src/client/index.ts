import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader, createInputTransfer, createNewHosts, hmrModule, removeNgStyles } from '@angularclass/hmr';
// Virtual module that changes when any change to backend is detected
import 'backend_reload';

import log from '../common/log';
import { Main } from './app/Main';
import NavBar from './app/NavBar';
import routes from './app/Routes.web';
import CounterView from './modules/counter/components/CounterView.web';
import { CounterService } from './modules/counter/containers/Counter';
import { PostCommentForm } from './modules/post/components/PostCommentForm.web';
import { PostCommentsView } from './modules/post/components/PostCommentsView.web';
import { PostEditView } from './modules/post/components/PostEditView.web';
import { PostForm } from './modules/post/components/PostForm.web';
import { PostList } from './modules/post/components/PostList.web';
import { PostService } from './modules/post/containers/Post';

// Apollo imports
import { ApolloModule } from 'apollo-angular';
import { clientProvider } from './app/Main';

@NgModule({
  bootstrap: [Main],
  declarations: [
    Main,

    /* Components */
    NavBar,
    CounterView,
    PostList,
    PostEditView,
    PostForm,
    PostCommentsView,
    PostCommentForm
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ApolloModule.withClient(clientProvider),
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  entryComponents: [NavBar, CounterView],
  providers: [CounterService, PostService]
})
class MainModule {
  constructor(public appRef: ApplicationRef) {}

  public hmrOnInit(store: any) {
    if (!store || !store.state) {
      return;
    }
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
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = { data: 'yolo' };
    // store.state = Object.assign({}, appState)
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
