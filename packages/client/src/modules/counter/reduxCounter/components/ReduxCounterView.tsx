import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CounterIncrement } from '../reducers';

@Component({
  selector: 'redux-counter-button',
  template: `
    <button id="redux-button" (click)="increaseCounter()">Click to increase reduxCount</button>
  `,
  styles: []
})
export class ReduxCounterButtonComponent {
  constructor(private store: Store<{ counter: number }>) {}

  public increaseCounter() {
    this.store.dispatch(new CounterIncrement());
  }
}

@Component({
  selector: 'redux-counter',
  template: `
    <section>
      <p>Redux Counter Amount: {{ counter }}</p>
      <redux-counter-button></redux-counter-button>
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
export class ReduxCounterViewComponent {
  public counter: any;

  constructor(private store: Store<{ counter: number }>) {
    this.store.pipe(select('counter')).subscribe(result => (this.counter = result.reduxCount));
  }
}
