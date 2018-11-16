import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CounterIncrement } from '../reducers';

// import React from 'react';
// import styled from 'styled-components';

// import { Button } from '../../../common/components/web';

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
export class ReduxCounterViewComponent extends Component {
  public counter: any;

  constructor(private store: Store<{ counter: number }>) {
    super();
    store.pipe(select('counter')).subscribe(result => (this.counter = result.reduxCount));
  }
}

// const Section = styled.section`
//   margin-bottom: 30px;
//   text-align: center;
// `;

// interface ViewProps {
//   text: string;
//   children: any;
// }

// export const ReduxCounterView = ({ text, children }: ViewProps): any => (
//   <Section>
//     <p>{text}</p>
//     {children}
//   </Section>
// );

// interface ButtonProps {
//   onClick: () => any;
//   text: string;
// }

// export const ReduxCounterButton = ({ onClick, text }: ButtonProps): any => (
//   <Button id="redux-button" color="primary" onClick={onClick}>
//     {text}
//   </Button>
// );
