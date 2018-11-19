import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

import createApolloClient from '../../../common/createApolloClient';
import modules from '../modules';
import log from '../../../common/log';
import { apiUrl } from '../net';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

const client = createApolloClient({
  apiUrl,
  createNetLink: modules.createNetLink,
  links: modules.link,
  connectionParams: modules.connectionParams,
  clientResolvers: modules.resolvers
});

if (module.hot) {
  module.hot.dispose(() => {
    delete window.__APOLLO_STATE__;
  });
}

@Component({
  selector: 'body div:first-child',
  template: '<router-outlet></router-outlet>'
})
class MainComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta
  ) {
    this.meta.addTag({ name: 'description', content: 'Apollo Universal Starter Kit' });
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this.titleService.setTitle(event.title);
        this.meta.updateTag({ name: 'description', content: event.meta });
      });
  }
}

export { client, MainComponent };
