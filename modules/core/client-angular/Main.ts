import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { apiUrl } from '@gqlapp/core-common';

import log from '../../../packages/common/log';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const metaReducers: Array<MetaReducer<any, any>> = [stateSetter];

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

export { MainComponent, metaReducers };
