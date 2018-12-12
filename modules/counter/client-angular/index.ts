import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import counters from './counters';
import ClientModule from '@module/module-client-angular';
import { CounterComponent } from './containers/Counter';

@NgModule({
  imports: [CommonModule, ...counters.counterModule],
  declarations: [CounterComponent],
  exports: [...counters.counterModule]
})
export class CounterModule {}

export default new ClientModule(counters, {
  route: [{ path: '', component: CounterComponent, data: { title: 'Counter', meta: 'Counter example page' } }],
  module: [CounterModule]
});
