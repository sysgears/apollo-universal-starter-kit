import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import CounterModule from '../CounterModule';
import { ServerCounterViewComponent, ServerCounterButtonComponent } from './components/ServerCounterView';

@NgModule({
  imports: [CommonModule],
  declarations: [ServerCounterButtonComponent, ServerCounterViewComponent],
  exports: [ServerCounterButtonComponent, ServerCounterViewComponent]
})
class ServerCounterModule {}

export default new CounterModule({
  counterModule: [ServerCounterModule]
});
