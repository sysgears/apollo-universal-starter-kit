import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <client-counter></client-counter>
      <redux-counter></redux-counter>
      <server-counter></server-counter>
    </div>
  `
})
export class CounterComponent {}
