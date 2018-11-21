import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <client-counter></client-counter>
      <ngrx-counter></ngrx-counter>
      <server-counter></server-counter>
    </div>
  `
})
export class CounterComponent {}
