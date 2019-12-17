import React, { ReactElement } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import { addTypenameToDocument } from 'apollo-utilities';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { JSDOM } from 'jsdom';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { combineReducers, createStore, Store } from 'redux';
import { graphql, print, getOperationAST, DocumentNode, GraphQLSchema } from 'graphql';
import { Provider } from 'react-redux';
import { ApolloClient } from 'apollo-client';
import { render, RenderResult } from '@testing-library/react';

import { createApolloClient } from '@gqlapp/core-common';
import ClientModule from '@gqlapp/module-client-react';

if (!process.env.JEST_WORKER_ID) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
  (global as any).document = dom.window.document;
  (global as any).window = dom.window;
  // Needed by Formik >= 1.x
  (global as any).HTMLButtonElement = dom.window.HTMLButtonElement;
  (global as any).navigator = dom.window.navigator;
  process.on('uncaughtException', ex => {
    console.error('Uncaught error', ex.stack);
  });
}

const ref: { clientModules: ClientModule; typeDefs: DocumentNode[] } = { clientModules: null, typeDefs: null };

export const initRenderer = (graphqlTypeDefs: DocumentNode[], clientModules: ClientModule) => {
  ref.clientModules = clientModules;
  ref.typeDefs = graphqlTypeDefs;
};

class MockLink extends ApolloLink {
  private schema: GraphQLSchema;
  private handlers: any[];
  private subscriptions: any;
  private subscriptionQueries: any;
  private subId: number;

  constructor(schema: GraphQLSchema) {
    super();
    this.schema = schema;
    this.handlers = [];
    this.subscriptions = {};
    this.subscriptionQueries = {};
    this.subId = 1;
  }

  public request(request: Operation) {
    const operationAST = getOperationAST(request.query, request.operationName);
    if (!!operationAST && operationAST.operation === 'subscription') {
      return new Observable(observer => {
        try {
          const subId = this.subId++;
          const queryStr = print(request.query);
          const key = JSON.stringify({
            query: queryStr,
            variables: request.variables
          });
          this.handlers[subId] = {
            handler: observer,
            key,
            query: queryStr,
            variables: request.variables
          };
          this.subscriptions[key] = this.subscriptions[key] || [];
          this.subscriptions[key].push(subId);
          this.subscriptionQueries[queryStr] = this.subscriptionQueries[queryStr] || [];
          this.subscriptionQueries[queryStr].push(subId);

          return () => {
            try {
              const { key: handlerKey, query } = this.handlers[subId];
              this.subscriptions[handlerKey].splice(this.subscriptions[handlerKey].indexOf(subId), 1);
              if (!this.subscriptions[handlerKey].length) {
                delete this.subscriptions[handlerKey];
              }
              this.subscriptionQueries[query].splice(this.subscriptionQueries[query].indexOf(subId), 1);
              if (!this.subscriptionQueries[query].length) {
                delete this.subscriptionQueries[query];
              }
              delete this.handlers[subId];
            } catch (e) {
              console.error(e);
            }
          };
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      return new Observable(observer => {
        graphql(this.schema, print(request.query), {}, {}, request.variables, request.operationName)
          .then(data => {
            if (!observer.closed) {
              observer.next(data);
              observer.complete();
            }
          })
          .catch(error => {
            if (!observer.closed) {
              observer.error(error);
            }
          });
      });
    }
  }

  public _getSubscriptions(query: DocumentNode, variables?: any) {
    if (!query) {
      return this.subscriptionQueries;
    }
    const queryStr = print(addTypenameToDocument(query));
    const key = JSON.stringify({
      query: queryStr,
      variables: variables || {}
    });
    const subscriptions = (!variables ? this.subscriptionQueries[queryStr] : this.subscriptions[key]) || [];

    const handlers = this.handlers;

    return subscriptions.map((subId: number) => {
      const res = {
        next(value: any) {
          return handlers[subId].handler.next(value);
        },
        error(errorValue: any) {
          return handlers[subId].handler.error(errorValue);
        }
      };
      (res as any).variables = handlers[subId].variables;
      return res;
    });
  }
}

export class Renderer {
  private client: ApolloClient<any>;
  private store: Store;
  public history: MemoryHistory<any>;
  private mockLink: MockLink;

  constructor(graphqlMocks: any, reduxState?: any, resolvers?: any) {
    const schema = makeExecutableSchema({
      typeDefs: ref.typeDefs
    });
    addMockFunctionsToSchema({ schema, mocks: graphqlMocks });

    const schemaLink = new MockLink(schema);

    const client = createApolloClient({
      createNetLink: () => schemaLink,
      createLink: ref.clientModules.createLink,
      clientResolvers: resolvers || ref.clientModules.resolvers
    });

    const store = createStore(
      combineReducers({
        ...ref.clientModules.reducers
      }),
      reduxState || {}
    );

    const history = createMemoryHistory();

    this.client = client;
    this.store = store;
    this.history = history;
    this.mockLink = schemaLink;
  }

  public withApollo(component: ReactElement<any>) {
    return ref.clientModules.getWrappedRoot(
      <Provider store={this.store}>
        <ApolloProvider client={this.client}>{component}</ApolloProvider>
      </Provider>
    );
  }

  public getSubscriptions(query: DocumentNode, variables?: any) {
    return this.mockLink._getSubscriptions(query, variables);
  }

  public mount(): RenderResult {
    return render(
      this.withApollo(
        ref.clientModules.getWrappedRoot(
          <Router history={this.history}>
            <Switch>{ref.clientModules.routes}</Switch>
          </Router>
        )
      )
    );
  }
}
