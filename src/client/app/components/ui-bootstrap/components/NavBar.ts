import { Component } from '@angular/core';

import { settings } from '../../../../../../settings';
import { modules } from '../../';

@Component({
  selector: 'nav-bar',
  template: `
    <nav class="navbar navbar-light bg-faded">
      <div class="container">
        <ul class="nav col-md-6 left-side">
          <menu-item>
            <nav-link [name]="'${settings.app.name}'" [to]="'/'" [type]="'brand'"></nav-link>
          </menu-item>
          ${modules.navItems}
        </ul>
        <ul class="nav col-md-6 right-side">
          <menu-item>
            <nav-link [name]="'GraphiQL'" [to]="'/graphiql'" [type]="'href'"></nav-link>
          </menu-item>
          ${modules.navItemsRight}
        </ul>
      </div>
    </nav>`,
  styles: ['ul.right-side { display: block; }', 'ul.right-side menu-item { float: right; display: inline-block; }']
})
export class NavBar {}
