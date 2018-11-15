import { Component } from '@angular/core';
import { Apollo, Query, QueryRef } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import React from 'react';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

@Component({
  selector: 'client-counter-button',
  template: `
    <button id="apollo-link-button" (click)="increaseCounter()">Click to increase apolloLinkState</button>
  `,
  styles: []
})
export class ClientCounterButtonComponent {
  constructor(private apollo: Apollo) {}

  public increaseCounter() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addClientCounter($amount: Int!) {
            addClientCounter(increment: $amount) @client {
              amount
            }
          }
        `,
        variables: {
          amount: 1
        }
      })
      .subscribe();
  }
}

@Component({
  selector: 'client-counter',
  template: `
    <section>
      <p>Client Counter Amount: {{ counter | async }}</p>
      <client-counter-button></client-counter-button>
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
export class ClientCounterViewComponent extends Component {
  public counter: any;
  public commentsQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {
    super();
  }

  public ngOnInit() {
    this.commentsQuery = this.apollo.watchQuery<Query>({
      query: gql`
        query clientCounterQuery {
          clientCounter @client {
            amount
          }
        }
      `
    });

    this.counter = this.commentsQuery.valueChanges.pipe(map((result: any) => result.data.clientCounter.amount));
  }
}

interface ViewProps {
  text: string;
  children: any;
}

const ClientCounterView = ({ text, children }: ViewProps) => (
  <Section>
    <p>{text}</p>
    {children}
  </Section>
);

interface ButtonProps {
  onClick: () => any;
  text: string;
}

const ClientCounterButton = ({ onClick, text }: ButtonProps) => (
  <Button id="apollo-link-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);
