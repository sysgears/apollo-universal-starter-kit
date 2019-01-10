import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <page-layout>
      <client-counter></client-counter>
      <ngrx-counter></ngrx-counter>
      <server-counter></server-counter>
    </page-layout>
  `
})
export class CounterComponent {}
