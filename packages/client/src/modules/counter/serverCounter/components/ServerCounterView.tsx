import React from 'react';
import styled from 'styled-components';
import { Component } from '@angular/core';
import { Apollo, Query } from 'apollo-angular';
import { map } from 'rxjs/operators';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';

import { Button } from '../../../common/components/web';
import { TranslateFunction } from '../../../../i18n';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

interface ViewProps {
  t: TranslateFunction;
  children: any;
  counter: any;
  loading: boolean;
}

@Component({
  selector: 'server-counter-button',
  template: `
    <Button id="graphql-button" color="primary" (click)="increaseCounter()">
      Click to increase counter
    </Button>
  `,
  styles: []
})
export class ServerCounterButtonComponent {
  constructor(private apollo: Apollo) {}

  public increaseCounter() {
    this.apollo
      .mutate({
        mutation: ADD_COUNTER,
        variables: {
          amount: 1
        }
      })
      .subscribe();
  }
}

@Component({
  selector: 'server-counter',
  template: `
    <section *ngIf="!counter">
      <div className="text-center">Loading</div>
    </section>
    <section *ngIf="counter">
      <p>Amount: {{counter | async}}</p>
      <server-counter-button></server-counter-button>
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
export class ServerCounterViewComponent extends Component {
  public counter: any;

  constructor(private apollo: Apollo) {
    super();
  }

  public ngOnInit() {
    this.counter = this.apollo
      .watchQuery<Query>({
        query: COUNTER_QUERY
      })
      .valueChanges.pipe(map((result: any) => result.data.serverCounter.amount));
  }
}

const ServerCounterView = ({ t, children, counter, loading }: ViewProps) => {
  if (loading) {
    return (
      <Section>
        <div className="text-center">{t('loading')}</div>
      </Section>
    );
  } else {
    return (
      <Section>
        <p>{t('text', { amount: counter.amount })}</p>
        {children}
      </Section>
    );
  }
};

interface ButtonProps {
  onClick: () => any;
  text: string;
}

const ServerCounterButton = ({ onClick, text }: ButtonProps) => (
  <Button id="graphql-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);
