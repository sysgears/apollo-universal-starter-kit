import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { resolvers } from '@module/counter-common';
import CounterModule from '../CounterModule';
import { ClientCounterButtonComponent, ClientCounterViewComponent } from './components/ClientCounterView';

@NgModule({
  imports: [CommonModule],
  declarations: [ClientCounterButtonComponent, ClientCounterViewComponent],
  exports: [ClientCounterButtonComponent, ClientCounterViewComponent]
})
class ClientCounterModule {}

export default new CounterModule({
  resolver: [resolvers],
  counterModule: [ClientCounterModule]
});
