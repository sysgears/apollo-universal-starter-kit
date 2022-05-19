import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import ClientModule from '@gqlapp/module-client-angular';
import counters from './counters';
import { CounterComponent } from './containers/Counter';

@NgModule({
  imports: [CommonModule, ...counters.counterModule],
  declarations: [CounterComponent],
  exports: [...counters.counterModule],
})
export class CounterModule {}

export default new ClientModule(counters, {
  route: [{ path: '', component: CounterComponent, data: { title: 'Counter', meta: 'Counter example page' } }],
  module: [CounterModule],
});
