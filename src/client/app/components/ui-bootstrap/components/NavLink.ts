import { Component, Input } from '@angular/core';

@Component({
  selector: 'nav-link',
  template: `
    <ausk-link [to]="to" [type]="type" [navLink]="true">{{ name }}</ausk-link>
	`
})
export class NavLink {
  @Input() public name: string;
  @Input() public to: string;
  @Input() public type: string = 'router';
  public className: string;
}
