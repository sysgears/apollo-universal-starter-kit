import { APP_BOOTSTRAP_LISTENER, ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { Subscription } from 'rxjs/Subscription';
import { ServerStateTransferModule, StateTransferService } from '@ngx-universal/state-transfer';

import { MainModule } from '../../client';
import { Main } from '../../client/app/Main';

export function bootstrapFactory(appRef: ApplicationRef, stateTransfer: StateTransferService): () => Subscription {
  return () =>
    appRef.isStable
      .filter(stable => stable)
      .first()
      .subscribe(() => {
        stateTransfer.inject();
      });
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'apollo-universal-starter-kit' }),
    ServerModule,
    ServerStateTransferModule.forRoot(),
    MainModule
  ],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: bootstrapFactory,
      multi: true,
      deps: [ApplicationRef, StateTransferService]
    }
  ],
  bootstrap: [Main]
})
export class AppServerModule {}
