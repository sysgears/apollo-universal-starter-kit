import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookModule } from '@gqlapp/look-client-angular';

import CounterModule from '../CounterModule';
import { NgRxCounterButtonComponent, NgRxCounterViewComponent } from './components/NgRxCounterView';
import { reducer } from './reducers';

@NgModule({
  imports: [CommonModule, LookModule],
  declarations: [NgRxCounterButtonComponent, NgRxCounterViewComponent],
  exports: [NgRxCounterButtonComponent, NgRxCounterViewComponent]
})
class NgRxCounterModule {}

export default new CounterModule({
  reducer: [{ counter: reducer }],
  counterModule: [NgRxCounterModule]
});
