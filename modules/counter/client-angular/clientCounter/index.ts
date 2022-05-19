import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { resolvers } from '@gqlapp/counter-common';
import { LookModule } from '@gqlapp/look-client-angular';
import CounterModule from '../CounterModule';
import { ClientCounterButtonComponent, ClientCounterViewComponent } from './components/ClientCounterView';

@NgModule({
  imports: [CommonModule, LookModule],
  declarations: [ClientCounterButtonComponent, ClientCounterViewComponent],
  exports: [ClientCounterButtonComponent, ClientCounterViewComponent],
})
class ClientCounterModule {}

export default new CounterModule({
  resolver: [resolvers],
  counterModule: [ClientCounterModule],
});
