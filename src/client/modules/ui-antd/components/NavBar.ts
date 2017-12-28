import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import settings from '../../../../../settings';
import modules from '../../../modules';

@Component({
  selector: 'nav-bar',
  template: `
    <div class="ant-row">
      <div class="ant-col-14">
        <ul class="ant-menu ant-menu-dark ant-menu-root ant-menu-horizontal">
          <menu-item>
            <nav-link [name]="'${settings.app.name}'" [to]="'/'"></nav-link>
          </menu-item>
          ${modules.navItems}
        </ul>
      </div>
      <div class="ant-col-10">
        <ul class="ant-menu ant-menu-dark ant-menu-root ant-menu-horizontal" style="float: right">
          <menu-item>
            <nav-link [name]="'GraphiQL'" [to]="'/graphiql'" [type]="'href'"></nav-link>
          </menu-item>
          ${modules.navItemsRight}
        </ul>
      </div>
    </div>`
})
export default class {
  private menuItems: any;

  constructor(private element: ElementRef, private renderer: Renderer2, private router: Router) {}

  public ngAfterViewInit() {
    this.menuItems = this.element.nativeElement.querySelectorAll('menu-item');

    this.menuItems.forEach((mItem: any) => {
      let url = window.location.href.replace(/^(?:\/\/|[^\/]+)*\/#?/, '');
      url = url === '' ? this.router.url : url;
      if (mItem.querySelector('nav-link').attributes['ng-reflect-to'].value === url) {
        this.renderer.addClass(mItem, 'ant-menu-item-selected');
      }
      mItem.addEventListener('click', (e: any) => this.activate(e));
    });
  }

  public activate(e: any): void {
    this.menuItems.forEach((mItem: any) => {
      const action = mItem.contains(e.target || e.srcElement) ? 'addClass' : 'removeClass';
      this.renderer[action](mItem, 'ant-menu-item-selected');
    });
  }
}
