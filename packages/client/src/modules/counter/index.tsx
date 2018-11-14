import { Component } from '@angular/core';
import counters from './counters';
import ClientModule from '../ClientModule';

@Component({
  selector: 'app-counter',
  template: '<server-counter></server-counter>'
})
export class CounterComponent {}

export default new ClientModule(counters, {
  route: [{ path: '', component: CounterComponent }]
});
