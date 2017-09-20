import ApolloClient, { addTypenameToDocument } from 'apollo-client';
import { addApolloLogging } from 'apollo-logger';
import { Router, Switch } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { JSDOM } from 'jsdom';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { graphql, print } from 'graphql';
import { CookiesProvider } from 'react-cookie';

import rootSchema from '../../server/api/rootSchema.graphqls';
import serverModules from '../../server/modules';
import settings from '../../../settings';

const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

// React imports MUST come after `global.document =` in order for enzyme `unmount` to work
const React = require('react');
const { ApolloProvider } = require('react-apollo');
const { mount } = require('enzyme');
const clientModules = require('../modules').default;

process.on('uncaughtException', ex => {
  console.error('Uncaught error', ex.stack);
});

class MockNetworkInterface {
  constructor(schema) {
    this.schema = schema;
    this.handlers = {};
    this.subscriptions = {};
    this.subscriptionQueries = {};
    this.subId = 1;
  }

  query(request) {
    const { schema } = this;
    return graphql(schema, print(request.query), {}, {}, request.variables, request.operationName);
  }

  _getSubscriptions(query, variables) {
    const self = this;
    if (!query) {
      return this.subscriptionQueries;
    }
    const queryStr = print(addTypenameToDocument(query));
    const key = JSON.stringify({
      query: queryStr,
      variables: variables || {}
    });
    const subscriptions = (!variables ? this.subscriptionQueries[queryStr] : this.subscriptions[key]) || [];

    return subscriptions.map(subId => {
      const res = function() {
        return self.handlers[subId].handler.apply(this, arguments);
      };
      res.variables = self.handlers[subId].variables;
      return res;
    });
  }

  subscribe(request, handler) {
    try {
      const subId = this.subId++;
      const queryStr = print(request.query);
      const key = JSON.stringify({
        query: queryStr,
        variables: request.variables
      });
      this.handlers[subId] = {
        handler: handler,
        key: key,
        query: queryStr,
        variables: request.variables
      };
      this.subscriptions[key] = this.subscriptions[key] || [];
      this.subscriptions[key].push(subId);
      this.subscriptionQueries[queryStr] = this.subscriptionQueries[queryStr] || [];
      this.subscriptionQueries[queryStr].push(subId);
      return subId;
    } catch (e) {
      console.error(e);
    }
  }

  unsubscribe(subId) {
    if (!this.handlers[subId]) {
      throw new Error('Attempt to unsubscribe from non-existent subscription id:', subId);
    }

    try {
      const { key, query } = this.handlers[subId];
      this.subscriptions[key].splice(this.subscriptions[key].indexOf(subId), 1);
      if (!this.subscriptions[key].length) {
        delete this.subscriptions[key];
      }
      this.subscriptionQueries[query].splice(this.subscriptionQueries[query].indexOf(subId), 1);
      if (!this.subscriptionQueries[query].length) {
        delete this.subscriptionQueries[query];
      }
      delete this.handlers[subId];
    } catch (e) {
      console.error(e);
    }
  }
}

export default class Renderer {
  constructor(graphqlMocks, reduxState) {
    const schema = makeExecutableSchema({
      typeDefs: [rootSchema, ...serverModules.schemas]
    });
    addMockFunctionsToSchema({ schema, mocks: graphqlMocks });

    const mockNetworkInterface = new MockNetworkInterface(schema);

    const client = new ApolloClient({
      networkInterface: settings.apolloLogging ? addApolloLogging(mockNetworkInterface) : mockNetworkInterface
    });

    const store = createStore(
      combineReducers({
        apollo: client.reducer(),
        form: formReducer,
        ...clientModules.reducers
      }),
      reduxState,
      applyMiddleware(client.middleware())
    );

    const history = createHistory();

    this.client = client;
    this.store = store;
    this.history = history;
    this.networkInterface = mockNetworkInterface;
  }

  withApollo(component) {
    const { store, client } = this;

    return (
      <CookiesProvider>
        <ApolloProvider store={store} client={client}>
          {component}
        </ApolloProvider>
      </CookiesProvider>
    );
  }

  getSubscriptions(query, variables) {
    return this.networkInterface._getSubscriptions(query, variables);
  }

  mount() {
    return mount(
      this.withApollo(
        <Router history={this.history}>
          <Switch>{clientModules.routes}</Switch>
        </Router>
      )
    );
  }
}
