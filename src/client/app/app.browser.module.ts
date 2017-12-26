import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserStateTransferModule } from '@ngx-universal/state-transfer';

import { MainModule } from '../index';
import { Main } from './Main';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'apollo-universal-starter-kit' }),
    BrowserAnimationsModule,
    BrowserStateTransferModule.forRoot(),
    MainModule
  ],
  bootstrap: [Main]
})
export class AppBrowserModule {}
