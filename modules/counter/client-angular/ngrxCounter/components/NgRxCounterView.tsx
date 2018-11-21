import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CounterIncrement } from '../reducers';

@Component({
  selector: 'ngrx-counter-button',
  template: `
    <button id="ngrx-button" (click)="increaseCounter()">Click to increase ngrxCount</button>
  `,
  styles: []
})
export class NgRxCounterButtonComponent {
  constructor(private store: Store<{ counter: number }>) {}

  public increaseCounter() {
    this.store.dispatch(new CounterIncrement());
  }
}

@Component({
  selector: 'ngrx-counter',
  template: `
    <section>
      <p>NgRx Counter Amount: {{ counter }}</p>
      <ngrx-counter-button></ngrx-counter-button>
    </section>
  `,
  styles: [
    `
      section {
        margin-bottom: 30px;
        text-align: center;
      }
    `
  ]
})
export class NgRxCounterViewComponent {
  public counter: any;

  constructor(private store: Store<{ counter: number }>) {
    this.store.pipe(select('counter')).subscribe(result => (this.counter = result.ngrxCount));
  }
}
