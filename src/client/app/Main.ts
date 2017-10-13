import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import '../styles/styles.scss';

/* ApolloClient initialization */

import Cache from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import BatchHttpLink from 'apollo-link-batch-http';
import WebSocketLink from 'apollo-link-ws';
import { getOperationAST } from 'graphql';
import * as url from 'url';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const fetch = createApolloFetch({
  uri: hostname === 'localhost' ? '/graphql' : __BACKEND_URL__
});

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}${window.location.hostname}:${port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');

const link = ApolloLink.split(
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true
    }
  }),
  new BatchHttpLink({ fetch })
);

const cache = new Cache();

if (window.__APOLLO_STATE__) {
  cache.restore(window.__APOLLO_STATE__);
}

// The connection has been established according to the official docs
// (https://github.com/apollographql/apollo-client/blob/master/Upgrade.md)
const client = new ApolloClient({ link, cache });

export let clientProvider = () => {
  return client;
};

@Component({
  selector: 'body div:first-child',
  template: `<section>
      <nav-bar></nav-bar>
      <router-outlet></router-outlet>
    </section>`
})
export class Main implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) {}

  public ngOnInit(): void {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe(event => {
        this.titleService.setTitle(event.title);
      });
  }
}
