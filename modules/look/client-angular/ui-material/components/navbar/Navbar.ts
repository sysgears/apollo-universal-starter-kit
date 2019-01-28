import { Component } from '@angular/core';
import ClientModule, { NavigationItem } from '@gqlapp/module-client-angular';

import settings from '../../../../../../settings';

const ref: any = { modules: null };

export const onAppCreate = (modules: ClientModule) => (ref.modules = modules);

@Component({
  selector: 'navbar',
  templateUrl: './Navbar.html',
  styleUrls: ['./Navbar.scss']
})
export class NavbarComponent {
  public appName: string = settings.app.name;
  public navItems: NavigationItem[] = ref.modules && ref.modules.navItems;
  public navItemsRight: NavigationItem[] = ref.modules && ref.modules.navItemsRight;
}
