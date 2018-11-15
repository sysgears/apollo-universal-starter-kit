import React from 'react';
import styled from 'styled-components';
import { Component } from '@angular/core';
import { Apollo, Query, QueryRef } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

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
    <button id="graphql-button" color="primary" (click)="increaseCounter()">Click to increase counter</button>
  `,
  styles: []
})
export class ServerCounterButtonComponent {
  constructor(private apollo: Apollo) {}

  public increaseCounter() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addServerCounter($amount: Int!) {
            addServerCounter(amount: $amount) {
              amount
            }
          }
        `,
        variables: {
          amount: 1
        }
        // update: (store, { data: { addServerCounter } }) => {
        //   // Read the data from our cache for this query.
        //   const data: any = store.readQuery({ query: COUNTER_QUERY });
        //   // Add our comment from the mutation to the end.
        //   data.serverCounter.amount = addServerCounter.amount;
        //   // Write our data back to the cache.
        //   store.writeQuery({ query: COUNTER_QUERY, data });
        // }
      })
      .subscribe();
  }
}

@Component({
  selector: 'server-counter',
  template: `
    <section *ngIf="!counter"><div className="text-center">Loading</div></section>
    <section *ngIf="counter">
      <p>Amount: {{ counter | async }}</p>
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
  public commentsQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {
    super();
  }

  public ngOnInit() {
    this.commentsQuery = this.apollo.watchQuery<Query>({
      query: gql`
        query serverCounterQuery {
          serverCounter {
            amount
          }
        }
      `
    });

    this.counter = this.commentsQuery.valueChanges.pipe(map((result: any) => result.data.serverCounter.amount));

    this.commentsQuery.subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const {
          data: {
            counterUpdated: { amount }
          }
        } = subscriptionData;

        return {
          ...prev,
          serverCounter: {
            amount,
            __typename: 'Counter'
          }
        };
      }
    });
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
