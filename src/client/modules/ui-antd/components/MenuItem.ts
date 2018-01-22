import { Component } from '@angular/core';

@Component({
  selector: 'menu-item',
  template: `
    <li>
      <ng-content></ng-content>
    </li>
  `,
  host: { class: 'ant-menu-item' }
})
export default class MenuItem {}
