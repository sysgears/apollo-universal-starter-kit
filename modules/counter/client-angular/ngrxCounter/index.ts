import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import CounterModule from '../CounterModule';
import { reducer } from './reducers';
import { NgRxCounterButtonComponent, NgRxCounterViewComponent } from './components/NgRxCounterView';

@NgModule({
  imports: [CommonModule],
  declarations: [NgRxCounterButtonComponent, NgRxCounterViewComponent],
  exports: [NgRxCounterButtonComponent, NgRxCounterViewComponent]
})
class NgRxCounterModule {}

export default new CounterModule({
  reducer: [{ counter: reducer }],
  counterModule: [NgRxCounterModule]
});
