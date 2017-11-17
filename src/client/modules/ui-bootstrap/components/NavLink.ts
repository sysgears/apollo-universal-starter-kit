import { Component, Input } from '@angular/core';

@Component({
  selector: 'nav-link',
  template: `
      <a class="{{ className }}" routerLinkActive="{{ linkActiveClass }}" routerLink="{{ to }}">{{ name }}</a>
	`
})
export default class NavLink {
  @Input() public name: string;
  @Input() public to: string;
  @Input() public className: string = 'nav-link';
  @Input() public linkActiveClass: string = 'active';
}
